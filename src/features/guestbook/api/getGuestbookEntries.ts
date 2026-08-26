import type { GuestbookEntry } from "../model/guestbook.types";

type GuestbookResponse = {
  entries?: GuestbookEntry[];
  message?: string;
};

export async function getGuestbookEntries() {
  const response = await fetch("/api/guestbook", {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const result = (await response.json()) as GuestbookResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "방명록을 불러오지 못했습니다.");
  }

  return result.entries ?? [];
}
