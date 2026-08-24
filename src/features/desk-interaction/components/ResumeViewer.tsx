"use client";

import { motion } from "framer-motion";
import { LuExternalLink, LuX } from "react-icons/lu";
import { RESUME_EMBED_URL, RESUME_PUBLIC_URL } from "../model/resume";

export function ResumeViewer({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="권태준 이력서"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full max-h-[900px] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <header className="relative z-10 flex h-12 shrink-0 items-center border-b border-slate-200 bg-white px-4">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.14em] text-slate-900">
              프로필
            </h2>
            <p className="text-[10px] text-slate-400">Notion</p>
          </div>
          <a
            href={RESUME_PUBLIC_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-auto grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="새 탭에서 이력서 열기"
          >
            <LuExternalLink size={17} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="ml-1 grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="이력서 닫기"
          >
            <LuX size={19} aria-hidden="true" />
          </button>
        </header>
        <iframe
          src={RESUME_EMBED_URL}
          title="권태준 Notion 이력서"
          className="relative -top-12 mb-[-3rem] min-h-0 flex-1 border-0 bg-white"
          style={{ colorScheme: "light" }}
          loading="eager"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </motion.section>
    </motion.div>
  );
}
