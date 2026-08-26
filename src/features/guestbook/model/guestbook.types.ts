export const GUESTBOOK_COLORS = [
  "yellow",
  "purple",
  "green",
  "blue",
  "pink",
] as const;

export type GuestbookColor = (typeof GUESTBOOK_COLORS)[number];

export type GuestbookEntry = {
  id: string;
  message: string;
  color: GuestbookColor;
  created_at: string;
};
