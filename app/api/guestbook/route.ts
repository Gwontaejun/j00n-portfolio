import { NextResponse } from "next/server";
import {
  GUESTBOOK_COLORS,
  type GuestbookColor,
  type GuestbookEntry,
} from "@/features/guestbook/model/guestbook.types";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/shared/lib/supabase/server";

const GUESTBOOK_QUERY_LIMIT = 60;
const MESSAGE_MAX_LENGTH = 150;
const WRITE_COOLDOWN_SECONDS = 30;

type CreateGuestbookBody = {
  message?: unknown;
  color?: unknown;
  website?: unknown;
};

function getVisitorAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function hashVisitor(request: Request) {
  const secret =
    process.env.GUESTBOOK_HASH_SALT ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "guestbook";
  const source = `${secret}:${getVisitorAddress(request)}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id,message,color,created_at")
      .order("created_at", { ascending: false })
      .limit(GUESTBOOK_QUERY_LIMIT);

    if (error) throw error;

    return NextResponse.json(
      { entries: (data ?? []) as GuestbookEntry[] },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { message: "방명록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateGuestbookBody;

    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ message: "등록할 수 없습니다." }, { status: 400 });
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const color = body.color;

    if (message.length < 1 || message.length > MESSAGE_MAX_LENGTH) {
      return NextResponse.json(
        { message: `방명록은 1자 이상 ${MESSAGE_MAX_LENGTH}자 이하로 입력해주세요.` },
        { status: 400 },
      );
    }

    if (
      typeof color !== "string" ||
      !GUESTBOOK_COLORS.includes(color as GuestbookColor)
    ) {
      return NextResponse.json(
        { message: "올바른 포스트잇 색상을 선택해주세요." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const visitorHash = await hashVisitor(request);
    const cooldownStart = new Date(
      Date.now() - WRITE_COOLDOWN_SECONDS * 1000,
    ).toISOString();
    const { data: recentEntry, error: cooldownError } = await supabase
      .from("guestbook_entries")
      .select("id")
      .eq("visitor_hash", visitorHash)
      .gte("created_at", cooldownStart)
      .limit(1)
      .maybeSingle();

    if (cooldownError) throw cooldownError;
    if (recentEntry) {
      return NextResponse.json(
        { message: `${WRITE_COOLDOWN_SECONDS}초 후에 다시 등록해주세요.` },
        { status: 429 },
      );
    }

    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert({
        message,
        color,
        visitor_hash: visitorHash,
        status: "visible",
      })
      .select("id,message,color,created_at")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { entry: data as GuestbookEntry },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "방명록을 등록하지 못했습니다." },
      { status: 500 },
    );
  }
}
