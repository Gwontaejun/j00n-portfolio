'use client';

import { LuCircleHelp } from 'react-icons/lu';

type IntroOverlayProps = {
  hidden: boolean;
  onOpenGuide: () => void;
};

export function IntroOverlay({ hidden, onOpenGuide }: IntroOverlayProps) {
  if (hidden) return null;

  return (
    <div className="pointer-events-none absolute right-0 top-0 z-[16777272] p-5 sm:p-8">
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          aria-label="책상 사용 가이드 열기"
          title="사용 가이드"
          onClick={onOpenGuide}
          className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white/75 backdrop-blur transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
        >
          <LuCircleHelp size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
