'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { IntroOverlay } from '@/features/project-browser/components/IntroOverlay';
import { ProjectPanel } from '@/features/project-browser/components/ProjectPanel';
import type { ProjectCategory } from '@/types/project';

const DeskScene = dynamic(
  () => import('@/features/desk-interaction/components/DeskScene').then((module) => module.DeskScene),
  {
    ssr: false,
    loading: () => <div className="h-full bg-[#080a0e]" />,
  },
);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [cameraControlsEnabled, setCameraControlsEnabled] = useState(false);
  const [isMonitorFocused, setIsMonitorFocused] = useState(false);

  const openProjects = useCallback((category: ProjectCategory, projectId?: string) => {
    setSelectedProjectId(projectId ?? null);
    setActiveCategory(category);
  }, []);

  const closePanel = useCallback(() => {
    setActiveCategory(null);
    setSelectedProjectId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#11141a] text-white">
      <section aria-label="3D 작업 책상" className="absolute inset-0">
        <DeskScene onSelect={openProjects} cameraControlsEnabled={cameraControlsEnabled} onMonitorFocusChange={setIsMonitorFocused} />
      </section>
      <IntroOverlay cameraControlsEnabled={cameraControlsEnabled} hidden={isMonitorFocused} onToggleCamera={() => setCameraControlsEnabled((enabled) => !enabled)} />
      <ProjectPanel category={activeCategory} selectedProjectId={selectedProjectId} onClose={closePanel} />
    </main>
  );
}
