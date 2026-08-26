"use client";

import { useEffect, useState } from "react";
import { getGuestbookEntries } from "../api/getGuestbookEntries";
import type { GuestbookEntry } from "../model/guestbook.types";

export function useGuestbookEntries() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getGuestbookEntries()
      .then((nextEntries) => {
        if (active) setEntries(nextEntries);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "방명록을 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const prependEntry = (entry: GuestbookEntry) => {
    setEntries((currentEntries) => [
      entry,
      ...currentEntries.filter((currentEntry) => currentEntry.id !== entry.id),
    ]);
  };

  return { entries, loading, error, prependEntry };
}
