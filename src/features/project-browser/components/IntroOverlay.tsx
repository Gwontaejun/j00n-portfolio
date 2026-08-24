'use client';

import { LuCamera, LuLock } from 'react-icons/lu';

type IntroOverlayProps = {
  cameraControlsEnabled: boolean;
  hidden: boolean;
  onToggleCamera: () => void;
};

export function IntroOverlay({ cameraControlsEnabled, hidden, onToggleCamera }: IntroOverlayProps) {
  if (hidden) return null;

  return (
    <div className="pointer-events-none absolute right-0 top-0 z-10 p-5 sm:p-8">
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          aria-pressed={cameraControlsEnabled}
          aria-label={cameraControlsEnabled ? '카메라 잠그기' : '카메라 움직이기'}
          title={cameraControlsEnabled ? '카메라 잠그기' : '카메라 움직이기'}
          onClick={onToggleCamera}
          className={`grid size-10 place-items-center rounded-full border backdrop-blur transition ${cameraControlsEnabled ? 'border-orange-200/60 bg-orange-200 text-[#171b24]' : 'border-white/15 bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'}`}
        >
          {cameraControlsEnabled ? <LuCamera size={18} aria-hidden="true" /> : <LuLock size={17} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
