'use client';

import { Html, useGLTF } from '@react-three/drei';
import { ModelAsset } from './ModelAsset';
import { appProjects } from '@/data/projects';
import { useCurrentDateTime } from '@/shared/hooks/useCurrentDateTime';
import { DESK_TOP_Y } from '../model/scene';

type PhoneProps = {
  onSelect: (projectId?: string) => void;
};

export function Phone({ onSelect }: PhoneProps) {
  const currentDateTime = useCurrentDateTime();
  const openFromKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <group position={[1.85, DESK_TOP_Y, -0.5]} rotation={[0, -0.28, 0]}>
      <ModelAsset path="/3d-models/phone-dock.glb" size={0.72} />
      <group position={[0, 0.51, -0.02]} rotation={[0.95, 0, 0]}>
        <ModelAsset path="/3d-models/phone.glb" size={0.74} />
        <Html
          center
          transform
          occlude
          position={[0, 0.034, 0.004]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={0.74}
          style={{
            pointerEvents: 'auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label="모바일 앱 프로젝트 탐색하기"
            onClick={() => onSelect()}
            onKeyDown={openFromKeyboard}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="group flex h-[384px] w-[176px] cursor-pointer flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(155deg,#3b2944_0%,#171526_48%,#0b111b_100%)] p-4 text-white shadow-2xl outline-none transition duration-300 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-pink-300/70"
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-white/80">
              <span>{currentDateTime.time}</span><span className="tracking-[.15em]">● ◔</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-5">
              {appProjects.slice(0, 6).map((project) => (
                <button
                  key={project.id}
                  type="button"
                  aria-label={`${project.title} 앱 프로젝트 보기`}
                  onClick={(event) => { event.stopPropagation(); onSelect(project.id); }}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-1 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span className="grid size-11 place-items-center rounded-[14px] text-[16px] font-semibold shadow-lg transition duration-200 group-hover:scale-105" style={{ background: `linear-gradient(145deg, ${project.accent}, ${project.accent}88)` }}>{project.title.slice(0, 1)}</span>
                  <span className="max-w-16 truncate text-[9px] text-white/65">{project.title}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto text-center">
              <p className="text-[16px] font-semibold">내 앱</p>
              <p className="mt-1 text-[10px] text-pink-100/55 transition group-hover:text-pink-100/85">눌러서 살펴보기 ↑</p>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

useGLTF.preload('/3d-models/phone.glb');
useGLTF.preload('/3d-models/phone-dock.glb');
