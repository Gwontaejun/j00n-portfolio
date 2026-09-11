"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  LuAccessibility,
  LuBadgeCheck,
  LuBriefcaseBusiness,
  LuCode,
  LuEye,
  LuExternalLink,
  LuFileText,
  LuFolder,
  LuFolderOpen,
  LuGraduationCap,
  LuLayoutGrid,
  LuMousePointerClick,
  LuNetwork,
  LuOrbit,
  LuShieldCheck,
  LuUserRound,
} from "react-icons/lu";
import {
  SiChartdotjs,
  SiCss,
  SiGithub,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiNextdotjs,
  SiReact,
  SiReacthookform,
  SiRecoil,
  SiRedux,
  SiSass,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { FaSlack } from "react-icons/fa6";
import { GiBearFace } from "react-icons/gi";
import { VscVscode } from "react-icons/vsc";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Quaternion, Vector3 } from "three";
import { ModelAsset } from "./ModelAsset";
import { webProjects, workProjects } from "@/data/projects";
import { useCurrentDateTime } from "@/shared/hooks/useCurrentDateTime";
import { DESK_TOP_Y } from "../model/scene";
import { useGuideHighlight } from "../hooks/useGuideHighlight";

const MONITOR_MODEL = "/3d-models/monitor.glb";
const MONITOR_MODEL_SIZE = 2.45;
const MONITOR_SCREEN_X = 0;
const MONITOR_SCREEN_Y = 1.195;

const skillIcons: Record<string, { icon: IconType; color: string }> = {
  React: { icon: SiReact, color: "#61dafb" },
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  "Three.js": { icon: SiThreedotjs, color: "#263244" },
  R3F: { icon: LuOrbit, color: "#8ba8ff" },
  Tiptap: { icon: LuFileText, color: "#d6d3d1" },
  Supabase: { icon: SiSupabase, color: "#3ecf8e" },
  "Next.js": { icon: SiNextdotjs, color: "#263244" },
  GSAP: { icon: SiGreensock, color: "#88ce02" },
  Tailwind: { icon: SiTailwindcss, color: "#06b6d4" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06b6d4" },
  Redux: { icon: SiRedux, color: "#764abc" },
  Zustand: { icon: GiBearFace, color: "#443e38" },
  Recoil: { icon: SiRecoil, color: "#3578e5" },
  "react-hook-form": { icon: SiReacthookform, color: "#ec5990" },
  shadcn: { icon: SiShadcnui, color: "#18181b" },
  JavaScript: { icon: SiJavascript, color: "#eab308" },
  HTML: { icon: SiHtml5, color: "#e34f26" },
  CSS: { icon: SiCss, color: "#1572b6" },
  SCSS: { icon: SiSass, color: "#cc6699" },
  Jira: { icon: SiJira, color: "#2684ff" },
  "VS Code": { icon: VscVscode, color: "#007acc" },
  Slack: { icon: FaSlack, color: "#611f69" },
  GitHub: { icon: SiGithub, color: "#24292f" },
  "Chart.js": { icon: SiChartdotjs, color: "#ff6384" },
};

const featureIcons = [LuNetwork, LuFileText, LuLayoutGrid, LuShieldCheck];

type ProjectFolderId = "work" | "side";
type MonitorWindowId = "project" | "folder" | "about";

const projectFolders = [
  { id: "work" as const, name: "실무 프로젝트" },
  { id: "side" as const, name: "사이드 프로젝트" },
];

const monitorProjects = [...workProjects, ...webProjects];

function SkillBadge({ name }: { name: string }) {
  const skill = skillIcons[name] ?? { icon: LuCode, color: "#cbd5e1" };
  const Icon = skill.icon;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-900/8 bg-white/75 px-3 py-2 shadow-sm">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-900/[.055]">
        <Icon size={14} color={skill.color} aria-hidden="true" />
      </span>
      <span className="text-[10px] font-semibold text-slate-700">{name}</span>
    </div>
  );
}

type MonitorProps = {
  focused: boolean;
  foregroundObjectActive?: boolean;
  guideHighlighted?: boolean;
  guideDimmed?: boolean;
  onClick: () => void;
};

export function Monitor({
  focused,
  foregroundObjectActive = false,
  guideHighlighted = false,
  guideDimmed = false,
  onClick,
}: MonitorProps) {
  const camera = useThree((state) => state.camera);
  const [frontFacing, setFrontFacing] = useState(true);
  const frontFacingRef = useRef(true);
  const monitorRef = useRef<Group>(null);
  const worldPosition = useRef(new Vector3());
  const worldQuaternion = useRef(new Quaternion());
  const screenNormal = useRef(new Vector3());
  const cameraDirection = useRef(new Vector3());
  const currentDateTime = useCurrentDateTime();
  const [selectedProjectId, setSelectedProjectId] = useState(
    webProjects[0]?.id ?? "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [projectWindowOpen, setProjectWindowOpen] = useState(false);
  const [projectWindowRunning, setProjectWindowRunning] = useState(false);
  const [folderWindowOpen, setFolderWindowOpen] = useState(false);
  const [folderWindowRunning, setFolderWindowRunning] = useState(false);
  const [aboutWindowOpen, setAboutWindowOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] =
    useState<ProjectFolderId>("work");
  const [activeWindowId, setActiveWindowId] =
    useState<MonitorWindowId>("folder");
  useGuideHighlight(monitorRef, guideHighlighted);
  const selectedProject =
    monitorProjects.find((project) => project.id === selectedProjectId) ??
    monitorProjects[0];
  const isWorkProject = selectedProject?.projectType === "실무 프로젝트";
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");
  const searchResults = normalizedSearchQuery
    ? monitorProjects.filter((project) =>
        [
          project.title,
          project.subtitle,
          project.organization,
          project.period,
          project.description,
          ...project.technologies,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ko-KR")
          .includes(normalizedSearchQuery),
      )
    : [];
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!focused && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  const handleTaskbarProjectClick = (
    event: MouseEvent<HTMLButtonElement>,
    projectId: string,
  ) => {
    event.stopPropagation();
    setSelectedProjectId(projectId);
    setProjectWindowRunning(true);
    setProjectWindowOpen(true);
    setActiveWindowId("project");
    if (!focused) onClick();
  };

  const handleFolderClick = (
    event: MouseEvent<HTMLButtonElement>,
    folderId: ProjectFolderId,
  ) => {
    event.stopPropagation();
    setSelectedFolderId(folderId);
    setFolderWindowRunning(true);
    setFolderWindowOpen(true);
    setActiveWindowId("folder");
    if (!focused) onClick();
  };

  const handleAboutClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAboutWindowOpen(true);
    setActiveWindowId("about");
    if (!focused) onClick();
  };

  const selectSearchedProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSearchQuery("");
    setProjectWindowRunning(true);
    setProjectWindowOpen(true);
    setActiveWindowId("project");
    if (!focused) onClick();
  };

  useFrame(() => {
    const monitor = monitorRef.current;
    if (!monitor) return;

    monitor.getWorldPosition(worldPosition.current);
    monitor.getWorldQuaternion(worldQuaternion.current);
    screenNormal.current.set(0, 0, 1).applyQuaternion(worldQuaternion.current);
    cameraDirection.current
      .copy(camera.position)
      .sub(worldPosition.current)
      .normalize();

    const nextFrontFacing = screenNormal.current.dot(cameraDirection.current) > 0;
    if (nextFrontFacing === frontFacingRef.current) return;

    frontFacingRef.current = nextFrontFacing;
    setFrontFacing(nextFrontFacing);
  });

  return (
    <group ref={monitorRef} position={[0, DESK_TOP_Y, -0.88]}>
      <group rotation={[0, -Math.PI / 2, 0]}>
        <ModelAsset path={MONITOR_MODEL} size={MONITOR_MODEL_SIZE} />
      </group>
      <rectAreaLight
        position={[MONITOR_SCREEN_X, MONITOR_SCREEN_Y - 0.02, 0.15]}
        rotation={[0, Math.PI, 0]}
        width={2.55}
        height={1.05}
        color="#78c4ff"
        intensity={1.35}
      />
      <pointLight
        position={[1.05, MONITOR_SCREEN_Y - 0.12, 0.28]}
        color="#9bd3ff"
        intensity={0.38}
        distance={2.6}
        decay={2}
      />
      <mesh position={[MONITOR_SCREEN_X, MONITOR_SCREEN_Y, 0.102]} renderOrder={2}>
        <planeGeometry args={[2.376, 1.386]} />
        <meshBasicMaterial color="#0b74c9" toneMapped={false} />
      </mesh>
      <Html
        center
        transform
        occlude={false}
        zIndexRange={[10, 0]}
        position={[MONITOR_SCREEN_X, MONITOR_SCREEN_Y, 0.104]}
        distanceFactor={0.495}
        style={{
          pointerEvents: foregroundObjectActive ? "none" : "auto",
          display: frontFacing ? "block" : "none",
          contain: "layout paint style",
          backgroundColor: "#0b74c9",
          borderRadius: "0px",
          overflow: "hidden",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter: guideDimmed ? "brightness(0.32)" : "none",
          transition: "filter 220ms ease",
        }}
      >
        <div
          role={focused ? undefined : "button"}
          tabIndex={focused ? -1 : 0}
          aria-label={
            focused ? "선택한 웹 프로젝트 정보" : "웹 프로젝트 살펴보기"
          }
          onClick={focused ? undefined : onClick}
          onKeyDown={handleKeyDown}
          style={{
            zoom: 2,
            WebkitFontSmoothing: "antialiased",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`group relative h-[560px] w-[960px] overflow-hidden rounded-none border-0 bg-[#0b74c9] text-left text-[#172033] shadow-lg outline-none transition-shadow duration-300 ${focused ? "cursor-default" : "cursor-pointer hover:ring-2 hover:ring-inset hover:ring-sky-500/35 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-500/70"}`}
        >
          <div
            className={`absolute inset-0 ${focused ? "pointer-events-auto" : "pointer-events-none"}`}
            inert={!focused}
            aria-hidden={!focused}
          >
          <AnimatePresence initial={false}>
          {projectWindowOpen && (
            <motion.div
              key="project-window"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={() => setActiveWindowId("project")}
              className={`absolute inset-x-0 bottom-[22px] top-0 origin-bottom overflow-hidden bg-[radial-gradient(circle_at_85%_0%,#ffffff_0%,#edf4f8_42%,#dce8f0_100%)] px-8 pb-4 pt-10 ${activeWindowId === "project" ? "z-30" : "z-10"}`}
            >
              <div className="absolute inset-x-0 top-0 h-8 border-b border-white/10 bg-[#111318] shadow-sm" />
              <div className="pointer-events-none absolute left-3 top-0 z-10 flex h-8 items-center gap-2 text-white/75">
                <Image
                  src={selectedProject.image}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 rounded-[3px] object-cover"
                />
                <span className="text-[7px] font-medium">
                  {selectedProject.title}
                </span>
              </div>
              <button
                type="button"
                aria-label="프로젝트 창 최소화"
                onClick={(event) => {
                  event.stopPropagation();
                  setProjectWindowOpen(false);
                  if (folderWindowOpen) setActiveWindowId("folder");
                }}
                className="absolute right-8 top-0 z-10 grid size-8 place-items-center text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:bg-white/15 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
              >
                <span className="h-px w-3 bg-current" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="프로젝트 창 닫기"
                onClick={(event) => {
                  event.stopPropagation();
                  setProjectWindowOpen(false);
                  setProjectWindowRunning(false);
                  if (folderWindowOpen) setActiveWindowId("folder");
                }}
                className="absolute right-0 top-0 z-10 grid size-8 place-items-center text-[13px] text-white/80 transition hover:bg-[#e81123] hover:text-white focus-visible:bg-[#e81123] focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              >
                ×
              </button>
              <div
                key={selectedProject.id}
                className={`grid h-full gap-5 ${
                  isWorkProject
                    ? "grid-cols-[.82fr_1.18fr]"
                    : "grid-cols-[1.15fr_.85fr]"
                }`}
              >
              {isWorkProject ? (
                <>
                  <section className="relative flex min-h-[350px] flex-col overflow-hidden rounded-2xl border border-slate-900/8 bg-[#f8fafc]/95 p-6 shadow-[0_16px_45px_rgba(71,85,105,.10)]">
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      style={{ backgroundColor: selectedProject.accent }}
                    />
                    <div className="flex items-start gap-4">
                      <Image
                        src={selectedProject.image}
                        alt=""
                        width={54}
                        height={54}
                        className="size-[54px] shrink-0 rounded-[15px] object-cover shadow-[0_10px_28px_rgba(15,23,42,.2)]"
                      />
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[7px] font-semibold tracking-[.18em] text-blue-600/75">
                          실무 프로젝트
                        </p>
                        <h3 className="mt-1.5 text-[20px] font-semibold leading-tight tracking-[-.025em] text-slate-900">
                          {selectedProject.title}
                        </h3>
                        <p className="mt-1 text-[8px] text-slate-500">
                          {selectedProject.subtitle}
                        </p>
                      </div>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200/80 bg-white/75 px-3 py-2.5">
                        <dt className="text-[6px] font-medium tracking-[.14em] text-slate-400">소속</dt>
                        <dd className="mt-1 text-[9px] font-semibold text-slate-700">
                          {selectedProject.organization}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-slate-200/80 bg-white/75 px-3 py-2.5">
                        <dt className="text-[6px] font-medium tracking-[.14em] text-slate-400">참여 기간</dt>
                        <dd className="mt-1 text-[9px] font-semibold text-slate-700">
                          {selectedProject.period}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 border-t border-slate-200/80 pt-4">
                      <p className="text-[8px] font-semibold text-slate-800">프로젝트 개요</p>
                      <p className="mt-2 text-[9px] leading-[1.8] text-slate-600">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div className="mt-auto border-t border-slate-200/80 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-semibold text-slate-800">사용 기술</p>
                        <span className="text-[6px] tracking-[.12em] text-slate-400">
                          {selectedProject.technologies.length} SKILLS
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {selectedProject.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-md border border-slate-200 bg-white/85 px-2 py-1 text-[7px] font-medium text-slate-600"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <aside className="min-h-[350px] rounded-2xl border border-slate-900/8 bg-white/70 p-5 shadow-[0_16px_45px_rgba(71,85,105,.08)]">
                    <div className="flex items-end justify-between border-b border-slate-900/8 pb-3">
                      <div>
                        <p className="text-[7px] font-medium tracking-[.15em] text-blue-600/70">CONTRIBUTION</p>
                        <h4 className="mt-1 text-[12px] font-semibold text-slate-900">담당 기능과 기여</h4>
                      </div>
                      <span className="text-[7px] text-slate-400">
                        {selectedProject.features?.length ?? 0} ITEMS
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {selectedProject.features?.map((feature, index) => {
                        const FeatureIcon = featureIcons[index % featureIcons.length];
                        return (
                          <article
                            key={feature.title}
                            className="min-h-[118px] rounded-xl border border-slate-200/90 bg-[#f8fafc]/90 p-3.5"
                          >
                            <span
                              className="grid size-7 place-items-center rounded-lg"
                              style={{ backgroundColor: `${selectedProject.accent}14` }}
                            >
                              <FeatureIcon
                                size={14}
                                style={{ color: selectedProject.accent }}
                                aria-hidden="true"
                              />
                            </span>
                            <h5 className="mt-3 text-[9px] font-semibold text-slate-800">
                              {feature.title}
                            </h5>
                            <p className="mt-1 text-[7px] leading-[1.55] text-slate-500">
                              {feature.description}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </aside>
                </>
              ) : (
                <>
              <section className="relative flex min-h-[350px] flex-col overflow-hidden rounded-2xl border border-slate-900/8 bg-white/80 p-6 shadow-[0_16px_45px_rgba(71,85,105,.10)]">
                <div className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full border border-indigo-400/10" />
                <div className="pointer-events-none absolute -right-4 -top-7 size-28 rounded-full border border-indigo-400/15" />
                <div className="relative flex items-center gap-4">
                  <Image
                    src={selectedProject.image}
                    alt={`${selectedProject.title} 아이콘`}
                    width={72}
                    height={72}
                    className="size-[72px] rounded-[20px] object-cover shadow-[0_18px_50px_rgba(0,0,0,.35)]"
                  />
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[8px]">
                      <span
                        className={`size-1.5 rounded-full ${
                          selectedProject.projectType === "실무 프로젝트"
                            ? "bg-blue-500"
                            : "bg-emerald-400"
                        }`}
                      />
                      <span
                        className={`tracking-[.1em] ${
                          selectedProject.projectType === "실무 프로젝트"
                            ? "text-blue-700/75"
                            : "text-emerald-700/75"
                        }`}
                      >
                        {selectedProject.projectType === "실무 프로젝트"
                          ? [selectedProject.organization, selectedProject.period]
                              .filter(Boolean)
                              .join(" · ")
                          : "서비스 운영 중"}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 whitespace-nowrap">
                      <h3
                        className={`font-semibold tracking-[-.03em] ${
                          selectedProject.projectType === "실무 프로젝트"
                            ? "text-[22px]"
                            : "text-[29px]"
                        }`}
                      >
                        {selectedProject.title}
                      </h3>
                      <span
                        className="text-[12px] text-slate-900/25"
                        aria-hidden="true"
                      >
                        |
                      </span>
                      <p className="text-[9px] tracking-[.08em] text-[#172033]">
                        {selectedProject.subtitle ?? "웹 프로젝트"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="relative mt-6 text-[8px] font-medium tracking-[.16em] text-slate-600">
                  프로젝트 소개
                </p>
                <p className="relative mt-2 max-w-[520px] text-[10px] leading-[1.85] text-slate-700">
                  {selectedProject.description}
                </p>
                {(selectedProject.href || selectedProject.repositoryHref) && (
                  <div className="relative mt-auto flex gap-2 pt-6">
                  {selectedProject.href && (
                    <a
                      href={selectedProject.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#202a3a] px-3 py-2.5 text-[9px] font-semibold text-white transition hover:bg-[#303d52]"
                    >
                      <LuExternalLink size={11} />
                      프로젝트 열기
                    </a>
                  )}
                  {selectedProject.repositoryHref && (
                    <a
                      href={selectedProject.repositoryHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-900/10 bg-white/70 px-3 py-2.5 text-[9px] font-medium text-slate-700 transition hover:border-slate-900/20 hover:bg-white"
                    >
                      <SiGithub size={11} />
                      GitHub
                    </a>
                  )}
                  </div>
                )}
              </section>
              <aside className="min-h-[350px] rounded-2xl border border-slate-900/8 bg-white/60 p-5 shadow-[0_16px_45px_rgba(71,85,105,.08)]">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-medium text-slate-800">
                    사용 기술
                  </p>
                  <span className="text-[7px] text-slate-500">
                    {selectedProject.technologies.length} SKILLS
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {selectedProject.technologies.map((technology) => (
                    <SkillBadge key={technology} name={technology} />
                  ))}
                </div>
                {selectedProject.features && (
                  <div className="mt-5 border-t border-slate-900/8 pt-4">
                    <p className="text-[9px] font-medium text-slate-800">
                      주요 기능
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {selectedProject.features.map((feature, index) => {
                        const FeatureIcon =
                          featureIcons[index % featureIcons.length];
                        return (
                          <div
                            key={feature.title}
                            className="flex items-start gap-2.5"
                          >
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-indigo-500/10">
                              <FeatureIcon
                                size={11}
                                className="text-indigo-600/75"
                                aria-hidden="true"
                              />
                            </span>
                            <div>
                              <p className="text-[8px] font-medium text-slate-700">
                                {feature.title}
                              </p>
                              <p className="mt-0.5 text-[7px] leading-3 text-slate-500">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </aside>
                </>
              )}
              </div>
            </motion.div>
          )}
          {folderWindowOpen && (
            <motion.div
              key={`folder-${selectedFolderId}`}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={() => setActiveWindowId("folder")}
              className={`absolute left-[200px] top-[72px] h-[286px] w-[560px] origin-center overflow-hidden rounded-md border border-slate-900/20 bg-[#f4f7fa] text-slate-800 shadow-[0_24px_65px_rgba(3,18,34,.42)] ${activeWindowId === "folder" ? "z-30" : "z-10"}`}
            >
              <header className="flex h-7 items-center border-b border-slate-900/10 bg-white pl-3 shadow-sm">
                <LuFolderOpen size={12} className="mr-2 text-amber-500" aria-hidden="true" />
                <h3 className="text-[8px] font-semibold">
                  {projectFolders.find((folder) => folder.id === selectedFolderId)?.name}
                </h3>
                <button
                  type="button"
                  aria-label="폴더 창 최소화"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFolderWindowOpen(false);
                    if (projectWindowOpen) setActiveWindowId("project");
                  }}
                  className="ml-auto grid size-7 place-items-center transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                >
                  <span className="h-px w-3 bg-current" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="폴더 창 닫기"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFolderWindowOpen(false);
                    setFolderWindowRunning(false);
                    if (projectWindowOpen) setActiveWindowId("project");
                  }}
                  className="grid size-7 place-items-center text-[12px] transition hover:bg-[#e81123] hover:text-white focus-visible:bg-[#e81123] focus-visible:text-white focus-visible:outline-none"
                >
                  ×
                </button>
              </header>
              <div className="h-[258px] p-4">
                {(selectedFolderId === "work" ? workProjects : webProjects).length > 0 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {(selectedFolderId === "work" ? workProjects : webProjects).map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        aria-label={`${project.title} 프로젝트 열기`}
                        onClick={(event) => handleTaskbarProjectClick(event, project.id)}
                        className="group flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-md px-2 py-2 text-center outline-none transition hover:bg-sky-100/80 focus-visible:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        <Image
                          src={project.image}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-lg object-cover shadow-md transition-transform group-hover:scale-105"
                        />
                        <span className="max-w-full truncate text-[9px] font-medium">
                          {project.title}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <LuFolderOpen size={34} className="mx-auto text-slate-300" aria-hidden="true" />
                      <p className="mt-2.5 text-[10px] font-semibold text-slate-600">
                        등록된 실무 프로젝트가 없습니다
                      </p>
                      <p className="mt-1 text-[7px] text-slate-400">
                        공개 가능한 프로젝트 내역을 준비하고 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {aboutWindowOpen && (
            <motion.section
              key="about-window"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={() => setActiveWindowId("about")}
              aria-label="권태준 소개"
              className={`absolute inset-x-0 bottom-[22px] top-0 overflow-hidden bg-[#f4f7fa] text-slate-800 [text-rendering:geometricPrecision] ${activeWindowId === "about" ? "z-30" : "z-10"}`}
            >
              <header className="flex h-8 items-center border-b border-white/10 bg-[#11151b] pl-3 text-white">
                <LuUserRound size={13} className="mr-2 text-sky-300" aria-hidden="true" />
                <h3 className="text-[8px] font-semibold">프로필</h3>
                <button
                  type="button"
                  aria-label="프로필 창 최소화"
                  onClick={(event) => {
                    event.stopPropagation();
                    setAboutWindowOpen(false);
                  }}
                  className="ml-auto grid size-8 place-items-center hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
                >
                  <span className="h-px w-3 bg-current" />
                </button>
                <button
                  type="button"
                  aria-label="프로필 창 닫기"
                  onClick={(event) => {
                    event.stopPropagation();
                    setAboutWindowOpen(false);
                  }}
                  className="grid size-8 place-items-center text-[13px] hover:bg-[#e81123] focus-visible:bg-[#e81123] focus-visible:outline-none"
                >
                  ×
                </button>
              </header>
              <div className="grid h-[calc(100%-32px)] grid-cols-[280px_1fr] gap-5 bg-[radial-gradient(circle_at_5%_0%,#e4f3ff_0%,#eef4f8_38%,#e4edf3_100%)] p-5">
                <aside className="sticky top-0 flex h-full min-h-0 flex-col rounded-2xl bg-[#172235] p-5 text-white shadow-lg">
                  <p className="text-[8px] font-semibold tracking-[.18em] text-sky-300/90">PROFILE</p>
                  <h2 className="mt-3 text-[25px] font-semibold tracking-[-.04em]">권태준</h2>
                  <p className="mt-2 text-[10px] font-medium text-sky-200/90">Frontend Developer</p>
                  <p className="mt-3 text-[9px] leading-[1.7] text-white/75">
                    React와 TypeScript를 중심으로 웹·앱 SI 솔루션을 개발해왔습니다.
                  </p>
                  <dl className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-[8px] text-white/55">생년월일</dt>
                      <dd className="text-[9px] font-medium">2000.10.26</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-[8px] text-white/55">전화번호</dt>
                      <dd className="text-[9px] font-medium">010-2305-3829</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-[8px] text-white/55">이메일</dt>
                      <dd className="text-[8.5px] font-medium">hope10204@daum.net</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-[8px] text-white/55">GitHub</dt>
                      <dd>
                        <a
                          href="https://github.com/Gwontaejun/"
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[8.5px] font-medium text-sky-200/85 transition hover:text-sky-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-300"
                        >
                          <SiGithub size={10} aria-hidden="true" />
                          Gwontaejun
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                    <div className="rounded-lg bg-white/[.055] p-2.5">
                      <div className="flex items-center gap-1.5 text-sky-300/75">
                        <LuGraduationCap size={10} aria-hidden="true" />
                        <p className="text-[7.5px] font-semibold tracking-[.08em]">학력</p>
                      </div>
                      <p className="mt-2 text-[8.5px] font-semibold leading-[1.45]">상일미디어고등학교</p>
                      <p className="mt-0.5 text-[7px] text-white/60">스마트소프트웨어과</p>
                      <p className="mt-1 text-[6.5px] text-white/45">2016.02 — 2019.02</p>
                    </div>
                    <div className="rounded-lg bg-white/[.055] p-2.5">
                      <div className="flex items-center gap-1.5 text-sky-300/75">
                        <LuBadgeCheck size={10} aria-hidden="true" />
                        <p className="text-[7.5px] font-semibold tracking-[.08em]">자격증</p>
                      </div>
                      <p className="mt-2 text-[8.5px] font-semibold leading-[1.45]">정보처리산업기사</p>
                      <p className="mt-1 text-[6.5px] text-white/45">2018.09 취득</p>
                    </div>
                  </div>
                </aside>
                <div className="panel-scroll min-h-0 overflow-y-auto px-5 py-3 pr-6">
                  <section>
                    <div className="flex items-end gap-3">
                      <span className="text-[22px] font-light leading-none text-sky-600/20">01</span>
                      <div>
                        <p className="text-[7.5px] font-semibold tracking-[.16em] text-sky-700/75">CAREER</p>
                        <h3 className="mt-1 text-[15px] font-semibold text-slate-900">이력 정보</h3>
                      </div>
                      <span className="mb-1 h-px flex-1 bg-gradient-to-r from-sky-200 to-transparent" />
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {[
                        ["드제이 · 프리랜서 계약", "2025.10 — 2026.03", "웹·앱 SI 솔루션 개발"],
                        ["드제이", "2021.04 — 2025.09", "웹·앱 SI 솔루션 개발"],
                      ].map(([company, period, role]) => (
                        <article key={period} className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white/75 px-3.5 py-3 shadow-[0_5px_16px_rgba(71,85,105,.06)]">
                          <span className="absolute inset-y-0 left-0 w-[2px] bg-sky-400/70" />
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-700">
                            <LuBriefcaseBusiness size={13} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-[10px] font-semibold text-slate-800">{company}</h4>
                              <time className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[7.5px] font-medium text-slate-500">{period}</time>
                            </div>
                            <p className="mt-1 text-[8px] text-slate-600">{role}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6">
                    <div className="flex items-end gap-3">
                      <span className="text-[22px] font-light leading-none text-sky-600/20">02</span>
                      <div>
                        <p className="text-[7.5px] font-semibold tracking-[.16em] text-sky-700/75">WORK EXPERIENCE</p>
                        <h3 className="mt-1 text-[15px] font-semibold text-slate-900">주요 업무 이력</h3>
                      </div>
                      <span className="mb-1 h-px flex-1 bg-gradient-to-r from-sky-200 to-transparent" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      [LuCode, "렌더링 성능 최적화", "다수의 폼과 실시간 통계 화면에 메모이징을 적용하고, 상태 변화에 따른 불필요한 렌더링 부하를 개선했습니다."],
                      [LuNetwork, "공통 API 모듈 개발", "Axios 인터셉터를 이용해 요청 성공·실패·로딩 상태와 요청 전후 처리를 공통 모듈로 구성했습니다."],
                      [LuLayoutGrid, "프로젝트 설계", "복잡도와 중복을 줄이기 위해 FSD를 적용하고, 재사용성을 위해 Atomic Design 기반 컴포넌트 구조를 설계했습니다."],
                      [LuAccessibility, "웹 접근성 준수", "키보드와 마우스 이용 상황을 고려한 이벤트를 개발하고 WebWatch 테스트 100%를 통과했습니다."],
                      [LuOrbit, "2D·3D 데이터 시각화", "deck.gl과 Mapbox GL의 Polygon, Building, Line 레이어로 시간별 인구 이동과 네트워크 데이터를 시각화했습니다."],
                    ].map(([ExperienceIcon, title, description], index) => {
                      const Icon = ExperienceIcon as IconType;
                      return (
                        <article key={title as string} className="relative min-h-[96px] overflow-hidden rounded-xl border border-slate-200/90 bg-white/70 p-3.5 pl-4 shadow-[0_5px_18px_rgba(71,85,105,.055)]">
                          <span className="absolute inset-y-3 left-0 w-[2px] rounded-full bg-sky-400/60" />
                          <span className="absolute right-3 top-2 text-[13px] font-semibold text-slate-900/[.035]">0{index + 1}</span>
                          <div className="relative flex items-center gap-2">
                            <span className="grid size-6 place-items-center rounded-md bg-sky-100 text-sky-700">
                              <Icon size={12} aria-hidden="true" />
                            </span>
                            <h4 className="text-[10px] font-semibold text-slate-800">{title as string}</h4>
                          </div>
                          <p className="relative mt-2 text-[8px] leading-[1.65] text-slate-600">{description as string}</p>
                        </article>
                      );
                    })}
                    </div>
                  </section>

                  <section className="mt-6 pb-4">
                    <div className="flex items-end gap-3">
                      <span className="text-[22px] font-light leading-none text-sky-600/20">03</span>
                      <div>
                        <p className="text-[7.5px] font-semibold tracking-[.16em] text-sky-700/75">SKILLS</p>
                        <h3 className="mt-1 text-[15px] font-semibold text-slate-900">기술 스택 및 협업 도구</h3>
                      </div>
                      <span className="mb-1 h-px flex-1 bg-gradient-to-r from-sky-200 to-transparent" />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl border border-slate-200/90 bg-white/75 p-4 shadow-[0_5px_16px_rgba(71,85,105,.05)]">
                        <p className="text-[10px] font-semibold text-slate-800">Framework &amp; Library</p>
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {["React", "Next.js", "Redux", "Zustand", "Recoil", "Tailwind CSS", "react-hook-form", "shadcn"].map((skill) => (
                            <SkillBadge key={skill} name={skill} />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Language & Style", ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS"]],
                          ["Tools", ["VS Code", "Jira", "Slack", "GitHub"]],
                        ].map(([category, skills]) => (
                          <div key={category as string} className="rounded-xl border border-slate-200/90 bg-white/75 p-4 shadow-[0_5px_16px_rgba(71,85,105,.05)]">
                            <p className="text-[10px] font-semibold text-slate-800">{category as string}</p>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {(skills as string[]).map((skill) => (
                                <SkillBadge key={skill} name={skill} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.section>
          )}
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="relative z-0 h-full overflow-hidden bg-[linear-gradient(135deg,#0b74c9_0%,#168bd4_42%,#67b9e5_100%)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(255,255,255,.26),transparent_32%)]" />
              <div className="pointer-events-none absolute right-[19%] top-[17%] grid h-56 w-56 grid-cols-2 gap-1.5 opacity-75 [transform:perspective(420px)_rotateY(-8deg)]">
                <span className="bg-white/45" />
                <span className="bg-white/35" />
                <span className="bg-white/35" />
                <span className="bg-white/25" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-2/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.08))]" />
              <section
                aria-label="프로젝트 둘러보기 안내"
                className="pointer-events-none absolute left-1/2 top-[47%] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#07345c]/90 px-6 py-5 text-white shadow-md"
              >
                <p className="text-[17px] font-semibold tracking-[-.025em]">프로젝트 둘러보기</p>
                <p className="mt-1.5 text-[7px] leading-[1.6] text-white/60">
                  폴더를 선택하거나 검색창을 이용해 프로젝트를 확인해 보세요.
                </p>
                <div className="mt-5 space-y-3.5">
                  {[
                    [LuMousePointerClick, "프로젝트 폴더 선택", "실무와 사이드 프로젝트를 나누어 살펴볼 수 있어요."],
                    [LuUserRound, "프로필 확인", "경력과 주요 업무 경험, 기술 스택을 확인할 수 있어요."],
                    [LuLayoutGrid, "작업표시줄에서 다시 열기", "최소화한 창은 하단 아이콘으로 복원할 수 있어요."],
                  ].map(([GuideIcon, title, description], index) => {
                    const Icon = GuideIcon as IconType;
                    return (
                      <div key={title as string} className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-sky-100">
                          <Icon size={13} aria-hidden="true" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[6px] text-sky-200/55">0{index + 1}</span>
                            <p className="text-[8px] font-semibold text-white/90">{title as string}</p>
                          </div>
                          <p className="mt-0.5 text-[6.5px] text-white/50">{description as string}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              <div className="absolute left-3 top-3 z-10 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  aria-label="프로필 열기"
                  onClick={handleAboutClick}
                  className="group/icon flex w-[70px] flex-col items-center gap-1 rounded px-1 py-1.5 text-center text-white outline-none transition hover:bg-white/15 focus-visible:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/80"
                >
                  <span className="grid size-[38px] place-items-center rounded-lg bg-gradient-to-br from-sky-200 to-blue-500 text-white shadow-[0_3px_8px_rgba(0,0,0,.28)] transition-transform group-hover/icon:scale-105">
                    <LuUserRound size={21} aria-hidden="true" />
                  </span>
                  <span className="text-[7px] leading-3 [text-shadow:0_1px_2px_rgba(0,0,0,.8)]">프로필</span>
                </button>
                {projectFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    aria-label={`${folder.name} 폴더 열기`}
                    onClick={(event) =>
                      handleFolderClick(event, folder.id)
                    }
                    className="group/icon flex w-[70px] flex-col items-center gap-1 rounded px-1 py-1.5 text-center text-white outline-none transition hover:bg-white/15 focus-visible:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/80"
                  >
                    <LuFolder
                      size={38}
                      fill="#f4c75d"
                      className="text-[#dcae43] drop-shadow-[0_3px_8px_rgba(0,0,0,.28)] transition-transform group-hover/icon:scale-105"
                      aria-hidden="true"
                    />
                    <span className="max-w-full text-[7px] leading-3 [text-shadow:0_1px_2px_rgba(0,0,0,.8)]">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div
            className="absolute inset-x-0 bottom-0 z-40 flex h-[22px] items-center bg-[#101010]/96 text-white shadow-[0_-1px_0_rgba(255,255,255,.08)]"
            aria-label="Windows 10 스타일 작업표시줄"
          >
            <span
              className="grid h-full w-8 place-items-center transition hover:bg-white/10"
              aria-hidden="true"
            >
              <span className="grid size-[11px] grid-cols-2 gap-px -skew-y-3">
                <i className="bg-white/90" />
                <i className="bg-white/90" />
                <i className="bg-white/90" />
                <i className="bg-white/90" />
              </span>
            </span>
            <div className="relative flex h-full w-40 items-center border-x border-white/25 bg-white/95 text-[7px] text-[#333]">
              <span
                className="pointer-events-none relative z-10 ml-2 block size-2.5 shrink-0 rounded-full border-[1.5px] border-[#3b3b3b]"
                aria-hidden="true"
              >
                <span className="absolute -bottom-[3px] -right-[2px] h-[5px] w-[1.5px] rotate-[-45deg] rounded-full bg-[#3b3b3b]" />
              </span>
              <input
                type="search"
                value={searchQuery}
                aria-label="프로젝트 검색"
                placeholder="프로젝트 검색"
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "Enter" && searchResults[0]) {
                    event.preventDefault();
                    selectSearchedProject(searchResults[0].id);
                  }
                  if (event.key === "Escape") setSearchQuery("");
                }}
                className="absolute inset-0 h-full w-full bg-transparent pl-7 pr-2 text-[7px] text-[#333] outline-none placeholder:text-[#555] [&::-webkit-search-cancel-button]:hidden"
              />
              {normalizedSearchQuery && (
                <div className="absolute bottom-[27px] left-0 z-20 w-56 overflow-hidden rounded-lg border border-slate-900/10 bg-white text-left text-slate-800 shadow-2xl">
                  {searchResults.length > 0 ? (
                    searchResults.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          selectSearchedProject(project.id);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
                      >
                        <Image
                          src={project.image}
                          alt=""
                          width={22}
                          height={22}
                          className="size-[22px] rounded-md object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block text-[9px] font-semibold">
                            {project.title}
                          </span>
                          <span className="block truncate text-[7px] text-slate-500">
                            {project.subtitle}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-3 text-[8px] text-slate-500">
                      검색 결과가 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
            {folderWindowRunning && (
              <button
                type="button"
                aria-label={`${projectFolders.find((folder) => folder.id === selectedFolderId)?.name} 폴더 열기`}
                aria-pressed={folderWindowOpen}
                onClick={(event) => handleFolderClick(event, selectedFolderId)}
                className="relative grid h-full w-8 place-items-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-300"
              >
                <LuFolder
                  size={16}
                  fill="#f4c75d"
                  className="text-[#dcae43]"
                  aria-hidden="true"
                />
                {folderWindowOpen && (
                  <span className="absolute bottom-0 h-px w-5 bg-sky-400" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label="프로필 창 열기"
              aria-pressed={aboutWindowOpen}
              onClick={handleAboutClick}
              className="relative grid h-full w-8 place-items-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-300"
            >
              <LuUserRound size={15} className="text-sky-300" aria-hidden="true" />
              {aboutWindowOpen && <span className="absolute bottom-0 h-px w-5 bg-sky-400" />}
            </button>
            {projectWindowRunning && selectedProject && (
              <button
                type="button"
                aria-label={`${selectedProject.title} 프로젝트 선택`}
                aria-pressed={projectWindowOpen}
                onClick={(event) =>
                  handleTaskbarProjectClick(event, selectedProject.id)
                }
                className="relative grid h-full w-8 place-items-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-300"
              >
                <Image
                  src={selectedProject.image}
                  alt=""
                  width={15}
                  height={15}
                  className="size-[15px] rounded-[3px] object-cover"
                />
                <span className="absolute bottom-0 h-px w-5 bg-sky-400" />
              </button>
            )}
            <time className="ml-auto px-3 text-center text-[6px] leading-[9px] text-white/75">
              <span className="block">{currentDateTime.time}</span>
              <span className="block">{currentDateTime.date}</span>
            </time>
          </div>
          </div>
          {!focused && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-neutral-500/0 transition-colors duration-300 group-hover:bg-neutral-500/35"
            >
              <div className="translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <LuEye
                  size={96}
                  strokeWidth={1.4}
                  className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,.55)]"
                />
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload(MONITOR_MODEL);
