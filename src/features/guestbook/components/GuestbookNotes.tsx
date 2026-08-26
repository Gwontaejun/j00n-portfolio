"use client";

import { type FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { LuCheck, LuPlus } from "react-icons/lu";
import { createGuestbookEntry } from "../api/createGuestbookEntry";
import { useGuestbookEntries } from "../hooks/useGuestbookEntries";
import {
  GUESTBOOK_COLORS,
  type GuestbookColor,
} from "../model/guestbook.types";

const NOTE_COLORS: Record<GuestbookColor, string> = {
  yellow: "#f1df8a",
  purple: "#d8c4e8",
  green: "#b9d9c4",
  blue: "#b9d8e8",
  pink: "#edc1c9",
};

const NOTE_ROTATIONS = [-2.5, 2, -1.2, 2.8, -2, 1.4] as const;
const MESSAGE_MAX_LENGTH = 150;

const paperStyle = {
  clipPath: "polygon(1% 0,100% 1%,98% 100%,0 98%)",
  backgroundImage:
    "linear-gradient(145deg,rgba(255,255,255,.2),transparent_46%,rgba(92,67,34,.08)),repeating-linear-gradient(92deg,rgba(255,255,255,.04)_0_1px,transparent_1px_3px)",
};

function Pin() {
  return (
    <span className="absolute left-1/2 top-3 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-black/15 bg-[#d96c5f] shadow-[0_2px_3px_rgba(0,0,0,.3)]" />
  );
}

type GuestbookNotesProps = {
  interactionDisabled: boolean;
  composerOpen: boolean;
  onFocusGuestbook: () => void;
  onOpenGuestbook: () => void;
  onCloseComposer: () => void;
};

export function GuestbookNotes({
  interactionDisabled,
  composerOpen,
  onFocusGuestbook,
  onOpenGuestbook,
  onCloseComposer,
}: GuestbookNotesProps) {
  const { entries, loading, error, prependEntry } = useGuestbookEntries();
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<GuestbookColor>("yellow");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const entry = await createGuestbookEntry({
        message: trimmedMessage,
        color,
        website,
      });
      prependEntry(entry);
      onCloseComposer();
      setMessage("");
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "방명록을 등록하지 못했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative h-[656px] w-[504px] overflow-y-auto overflow-x-hidden pr-2 [-webkit-font-smoothing:antialiased] [scrollbar-color:rgba(120,86,55,.55)_transparent] [scrollbar-width:thin]"
      style={{
        zoom: 1.7,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="grid grid-cols-3 gap-x-[18px] gap-y-[16px] pb-1">
        <button
          type="button"
          aria-label="방명록 등록하기"
          disabled={interactionDisabled}
          onClick={(event) => {
            event.stopPropagation();
            if (!interactionDisabled) onOpenGuestbook();
          }}
          className="group relative flex h-[152px] w-[152px] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-amber-900/30 bg-[#eadb83] px-4 pt-5 text-center text-[17px] font-bold leading-snug text-stone-700 shadow-[0_8px_15px_rgba(38,24,12,.22)] outline-none transition-transform hover:-translate-y-1 disabled:cursor-default focus-visible:ring-4 focus-visible:ring-sky-300"
          style={{ ...paperStyle, transform: "rotate(-2deg)" }}
        >
          <Pin />
          <LuPlus
            aria-hidden="true"
            size={26}
            strokeWidth={1.8}
            className="text-amber-950/70"
          />
          방명록 등록하기
        </button>

        {loading &&
          Array.from({ length: 3 }, (_, index) => (
            <div
              key={`guestbook-loading-${index}`}
              aria-hidden="true"
              className="relative h-[152px] w-[152px] animate-pulse bg-[#dfd3a0]/80 shadow-[0_8px_15px_rgba(38,24,12,.18)] motion-reduce:animate-none"
              style={{
                ...paperStyle,
                transform: `rotate(${NOTE_ROTATIONS[index]}deg)`,
              }}
            >
              <Pin />
            </div>
          ))}

        {!loading && error && (
          <div
            role="status"
            className="relative flex h-[152px] w-[152px] items-center justify-center bg-[#e4c1bd] px-5 pt-6 text-center text-[15px] font-semibold leading-[1.5] text-stone-700 shadow-[0_8px_15px_rgba(38,24,12,.22)]"
            style={{ ...paperStyle, transform: "rotate(2deg)" }}
          >
            <Pin />
            방명록을 불러오지 못했어요.
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div
            className="relative flex h-[152px] w-[152px] items-center justify-center bg-[#d8c4e8] px-5 pt-6 text-center text-[15px] font-semibold leading-[1.5] text-stone-700 shadow-[0_8px_15px_rgba(38,24,12,.22)]"
            style={{ ...paperStyle, transform: "rotate(2deg)" }}
          >
            <Pin />첫 번째 방명록을 남겨보세요.
          </div>
        )}

        {!loading &&
          !error &&
          entries.map((entry, index) => (
            <button
              type="button"
              key={entry.id}
              aria-label={`방명록 보기: ${entry.message}`}
              disabled={interactionDisabled}
              onClick={(event) => {
                event.stopPropagation();
                if (!interactionDisabled) onFocusGuestbook();
              }}
              className="relative flex h-[152px] w-[152px] cursor-pointer items-center justify-center overflow-hidden whitespace-pre-wrap break-words px-5 pt-6 text-center text-[16px] font-semibold leading-[1.5] text-stone-700 shadow-[0_8px_15px_rgba(38,24,12,.22)] outline-none transition-transform hover:-translate-y-1 disabled:cursor-default focus-visible:ring-4 focus-visible:ring-sky-300"
              style={{
                ...paperStyle,
                backgroundColor: NOTE_COLORS[entry.color] ?? NOTE_COLORS.yellow,
                transform: `rotate(${NOTE_ROTATIONS[index % NOTE_ROTATIONS.length]}deg)`,
              }}
            >
              <Pin />
              {entry.message}
            </button>
          ))}
      </div>

      {composerOpen &&
        createPortal(
          <div className="fixed inset-0 z-[19000000] flex items-center justify-center bg-black/15 px-5">
            <form
              aria-label="방명록 작성"
              onSubmit={handleSubmit}
              className="relative flex h-[360px] w-full max-w-[480px] flex-col px-9 pb-8 pt-11 text-stone-800 shadow-[0_18px_35px_rgba(28,16,7,.4)] transition-colors duration-200 [-webkit-font-smoothing:antialiased]"
              style={{
                ...paperStyle,
                backgroundColor: NOTE_COLORS[color],
              }}
            >
              <Pin />

              <div
                className="flex items-center gap-2"
                aria-label="포스트잇 색상"
              >
                {GUESTBOOK_COLORS.map((noteColor) => (
                  <button
                    key={noteColor}
                    type="button"
                    aria-label={`${noteColor} 색상`}
                    aria-pressed={color === noteColor}
                    onClick={() => setColor(noteColor)}
                    className="grid size-8 cursor-pointer place-items-center rounded-full border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
                    style={{ backgroundColor: NOTE_COLORS[noteColor] }}
                  >
                    {color === noteColor && (
                      <LuCheck size={15} strokeWidth={2.4} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>

              <label htmlFor="guestbook-message" className="sr-only">
                방명록 내용
              </label>
              <textarea
                id="guestbook-message"
                autoFocus
                required
                maxLength={MESSAGE_MAX_LENGTH}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="메시지를 입력하세요."
                className="mt-4 min-h-0 flex-1 resize-none border-t border-amber-950/15 bg-transparent py-4 text-[18px] font-medium leading-[1.65] outline-none placeholder:text-stone-600/38 focus:border-amber-950/35"
              />

              <input
                type="text"
                name="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />

              <div className="mt-4 flex min-h-10 items-center justify-between gap-3">
                <p
                  role={submitError ? "alert" : undefined}
                  className="min-w-0 flex-1 text-[13px] font-semibold text-red-800"
                >
                  {submitError ?? ""}
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={onCloseComposer}
                    className="cursor-pointer rounded-full px-5 py-2.5 text-[14px] font-semibold text-stone-700 transition hover:bg-black/8 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || submitting}
                    className="cursor-pointer rounded-full bg-stone-800 px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {submitting ? "등록 중..." : "등록"}
                  </button>
                </div>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  );
}
