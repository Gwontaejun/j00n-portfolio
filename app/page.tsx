'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { IntroOverlay } from '@/features/project-browser/components/IntroOverlay';
import { ProjectPanel } from '@/features/project-browser/components/ProjectPanel';
import { SceneGuide } from '@/features/project-browser/components/SceneGuide';
import type { ProjectCategory } from '@/types/project';
import type { SceneGuideTarget } from '@/types/scene-guide';

const GUIDE_TARGETS: SceneGuideTarget[] = ['monitor', 'phone', 'profile', 'guestbook'];

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
  const [isMonitorFocused, setIsMonitorFocused] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStepIndex, setGuideStepIndex] = useState(0);

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

  const closeGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  const openGuide = useCallback(() => {
    setGuideStepIndex(0);
    setIsGuideOpen(true);
  }, []);

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
    setGuideStepIndex(0);
    setIsGuideOpen(true);
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#11141a] text-white">
      <section aria-label="3D 작업 책상" className="absolute inset-0">
        <DeskScene
          onSelect={openProjects}
          onMonitorFocusChange={setIsMonitorFocused}
          onSceneReady={handleSceneReady}
          guideTarget={isGuideOpen ? GUIDE_TARGETS[guideStepIndex] : null}
        />
      </section>
      <IntroOverlay hidden={!isSceneReady || isMonitorFocused} onOpenGuide={openGuide} />
      <ProjectPanel category={activeCategory} selectedProjectId={selectedProjectId} onClose={closePanel} />
      <SceneGuide open={isGuideOpen} stepIndex={guideStepIndex} onStepChange={setGuideStepIndex} onClose={closeGuide} />
    </main>
  );
}
