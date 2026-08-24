'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CloseButton } from '@/components/ui/CloseButton';
import { appProjects, webProjects } from '@/data/projects';
import type { ProjectCategory } from '@/types/project';

type ProjectPanelProps = {
  category: ProjectCategory | null;
  selectedProjectId: string | null;
  onClose: () => void;
};

export function ProjectPanel({ category, selectedProjectId, onClose }: ProjectPanelProps) {
  const sourceProjects = category === 'web' ? webProjects : appProjects;
  const projects = selectedProjectId
    ? [...sourceProjects].sort((a, b) => Number(b.id === selectedProjectId) - Number(a.id === selectedProjectId))
    : sourceProjects;
  const heading = category === 'web' ? '웹 프로젝트' : '모바일 앱';

  return (
    <AnimatePresence>
      {category && (
        <motion.aside initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} aria-label={heading} className="absolute inset-x-3 bottom-3 top-auto z-20 max-h-[64dvh] overflow-hidden rounded-3xl border border-white/15 bg-[#171b24]/95 shadow-2xl backdrop-blur-xl sm:inset-y-5 sm:left-auto sm:right-5 sm:w-[410px] sm:max-h-none">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div><p className="text-xs font-medium tracking-[.16em] text-orange-200/70">선택한 기기</p><h2 className="mt-1 text-2xl font-semibold">{heading}</h2></div>
            <CloseButton onClick={onClose} label="프로젝트 패널 닫기" />
          </div>
          <div className="panel-scroll max-h-[calc(64dvh-96px)] space-y-3 overflow-y-auto p-4 sm:max-h-[calc(100dvh-122px)]">
            {projects.map((project) => {
              const selected = project.id === selectedProjectId;
              return (
                <article key={project.id} className={`rounded-2xl border p-4 transition ${selected ? 'border-pink-200/45 bg-pink-200/[.08]' : 'border-white/10 bg-white/[.045]'}`}>
                  {selected && <p className="mb-3 text-[10px] font-medium tracking-[.15em] text-pink-200">선택한 앱</p>}
                  <div className="mb-4 flex gap-4">
                    <div className="grid size-14 shrink-0 place-items-center rounded-2xl text-xl font-semibold" style={{ backgroundColor: `${project.accent}33`, color: project.accent }}>{project.title.slice(0, 1)}</div>
                    <div><h3 className="font-semibold">{project.title}</h3><p className="mt-1 text-sm leading-5 text-white/60">{project.description}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">{project.technologies.map((tech) => <span key={tech} className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/65">{tech}</span>)}</div>
                  <a href={project.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-white px-3 py-2 text-sm font-medium text-[#171b24] transition hover:bg-orange-100">{category === 'web' ? '웹사이트 보기 ↗' : '플레이스토어 보기 ↗'}</a>
                </article>
              );
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
