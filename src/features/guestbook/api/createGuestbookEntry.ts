import type {
  GuestbookColor,
  GuestbookEntry,
} from "../model/guestbook.types";

type CreateGuestbookInput = {
  message: string;
  color: GuestbookColor;
  website?: string;
};

type CreateGuestbookResponse = {
  entry?: GuestbookEntry;
  message?: string;
};

export async function createGuestbookEntry(input: CreateGuestbookInput) {
  const response = await fetch("/api/guestbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });
  const result = (await response.json()) as CreateGuestbookResponse;

  if (!response.ok || !result.entry) {
    throw new Error(result.message ?? "방명록을 등록하지 못했습니다.");
  }

  return result.entry;
}
