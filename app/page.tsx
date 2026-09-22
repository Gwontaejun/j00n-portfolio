"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { IntroOverlay } from "@/features/project-browser/components/IntroOverlay";
import { MobileExperienceNotice } from "@/features/project-browser/components/MobileExperienceNotice";
import {
  PortfolioBrand,
  PortfolioLoader,
} from "@/features/project-browser/components/PortfolioLoader";
import { SceneGuide } from "@/features/project-browser/components/SceneGuide";
import type { ProjectCategory } from "@/types/project";
import type { SceneGuideTarget } from "@/types/scene-guide";

const GUIDE_TARGETS: SceneGuideTarget[] = [
  "monitor",
  "phone",
  "profile",
  "guestbook",
];

const DeskScene = dynamic(
  () =>
    import("@/features/desk-interaction/components/DeskScene").then(
      (module) => module.DeskScene,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full bg-[#080a0e]" />,
  },
);

export default function Home() {
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(
    null,
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [isMonitorFocused, setIsMonitorFocused] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStepIndex, setGuideStepIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1399px)");
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const openProjects = useCallback(
    (category: ProjectCategory, projectId?: string) => {
      setSelectedProjectId(projectId ?? null);
      setActiveCategory(category);
    },
    [],
  );

  const closePanel = useCallback(() => {
    setActiveCategory(null);
    setSelectedProjectId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsExperienceVisible(true);
    setGuideStepIndex(0);
    setIsGuideOpen(true);
  }, []);

  if (isMobileViewport) {
    return <MobileExperienceNotice />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#11141a] text-white">
      <PortfolioLoader
        sceneReady={isSceneReady}
        onComplete={handleLoaderComplete}
      />
      {isMobileViewport === false && (
        <>
          <section aria-label="3D 작업 책상" className="absolute inset-0">
            <DeskScene
              onSelect={openProjects}
              onMonitorFocusChange={setIsMonitorFocused}
              onSceneReady={handleSceneReady}
              visible={isExperienceVisible}
              guideTarget={isGuideOpen ? GUIDE_TARGETS[guideStepIndex] : null}
            />
          </section>
          <PortfolioBrand
            hidden={!isExperienceVisible || isMonitorFocused}
          />
          <IntroOverlay
            hidden={!isExperienceVisible || isMonitorFocused}
            onOpenGuide={openGuide}
          />
          <SceneGuide
            open={isGuideOpen}
            stepIndex={guideStepIndex}
            onStepChange={setGuideStepIndex}
            onClose={closeGuide}
          />
        </>
      )}
    </main>
  );
}
