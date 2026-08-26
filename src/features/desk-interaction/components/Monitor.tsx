"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  LuCode,
  LuEye,
  LuExternalLink,
  LuFileText,
  LuLayoutGrid,
  LuMousePointerClick,
  LuNetwork,
  LuOrbit,
  LuSearch,
  LuShieldCheck,
} from "react-icons/lu";
import {
  SiChartdotjs,
  SiGithub,
  SiGreensock,
  SiNextdotjs,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Quaternion, Vector3 } from "three";
import { ModelAsset } from "./ModelAsset";
import { webProjects } from "@/data/projects";
import { useCurrentDateTime } from "@/shared/hooks/useCurrentDateTime";
import { DESK_TOP_Y } from "../model/scene";
import { useGuideHighlight } from "../hooks/useGuideHighlight";

const MONITOR_MODEL = "/3d-models/monitor.glb";

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
  "Chart.js": { icon: SiChartdotjs, color: "#ff6384" },
};

const featureIcons = [LuNetwork, LuFileText, LuLayoutGrid, LuShieldCheck];

function SkillBadge({ name }: { name: string }) {
  const skill = skillIcons[name] ?? { icon: LuCode, color: "#cbd5e1" };
  const Icon = skill.icon;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-900/8 bg-white/75 px-3 py-2 shadow-sm">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-900/[.055]">
        <Icon size={14} color={skill.color} aria-hidden="true" />
      </span>
      <span className="text-[9px] font-medium text-slate-800/80">{name}</span>
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
  useGuideHighlight(monitorRef, guideHighlighted);
  const selectedProject =
    webProjects.find((project) => project.id === selectedProjectId) ??
    webProjects[0];
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");
  const searchResults = normalizedSearchQuery
    ? webProjects.filter((project) =>
        [
          project.title,
          project.subtitle,
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
    if (!focused) onClick();
  };

  const selectSearchedProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSearchQuery("");
    setProjectWindowRunning(true);
    setProjectWindowOpen(true);
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
      <ModelAsset path={MONITOR_MODEL} size={2.45} />
      <rectAreaLight
        position={[0, 1.02, 0.15]}
        rotation={[0, Math.PI, 0]}
        width={2.55}
        height={1.05}
        color="#78c4ff"
        intensity={1.35}
      />
      <pointLight
        position={[1.05, 0.92, 0.28]}
        color="#9bd3ff"
        intensity={0.38}
        distance={2.6}
        decay={2}
      />
      <mesh position={[0, 1.04, 0.102]} renderOrder={2}>
        <planeGeometry args={[2.4, 1.22]} />
        <meshBasicMaterial color="#0b74c9" toneMapped={false} />
      </mesh>
      <Html
        center
        transform
        occlude="blending"
        position={[0, 1.04, 0.104]}
        distanceFactor={0.5}
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
          className={`group relative h-[488px] w-[960px] overflow-hidden rounded-none border-0 bg-[#0b74c9] text-left text-[#172033] shadow-lg outline-none transition-shadow duration-300 ${focused ? "cursor-default" : "cursor-pointer hover:ring-2 hover:ring-inset hover:ring-sky-500/35 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-500/70"}`}
        >
          <div
            className={`absolute inset-0 ${focused ? "pointer-events-auto" : "pointer-events-none"}`}
            inert={!focused}
            aria-hidden={!focused}
          >
          <AnimatePresence initial={false}>
          {projectWindowOpen ? (
            <motion.div
              key="project-window"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-6 top-0 origin-bottom overflow-hidden bg-[radial-gradient(circle_at_85%_0%,#ffffff_0%,#edf4f8_42%,#dce8f0_100%)] px-8 pb-6 pt-10"
            >
              <div className="absolute inset-x-0 top-0 h-7 border-b border-white/10 bg-[#111318] shadow-sm" />
              <button
                type="button"
                aria-label="프로젝트 창 최소화"
                onClick={(event) => {
                  event.stopPropagation();
                  setProjectWindowOpen(false);
                }}
                className="absolute right-9 top-0 z-10 grid size-7 place-items-center text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:bg-white/15 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400"
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
                }}
                className="absolute right-2 top-0 z-10 grid size-7 place-items-center text-[13px] text-white/80 transition hover:bg-[#e81123] hover:text-white focus-visible:bg-[#e81123] focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              >
                ×
              </button>
              <div
                key={selectedProject.id}
                className="grid grid-cols-[1.15fr_.85fr] gap-5"
              >
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
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      <span className="tracking-[.1em] text-emerald-700/75">
                        서비스 운영 중
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 whitespace-nowrap">
                      <h3 className="text-[29px] font-semibold tracking-[-.03em]">
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
                <div className="relative mt-auto flex gap-2 pt-6">
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="relative h-full overflow-hidden bg-[linear-gradient(135deg,#0b74c9_0%,#168bd4_42%,#67b9e5_100%)]"
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
                <p className="text-[17px] font-semibold tracking-[-.025em]">
                  프로젝트 둘러보기
                </p>
                <p className="mt-1.5 text-[7px] leading-[1.6] text-white/60">
                  아이콘을 선택하거나 검색창을 이용해 프로젝트를 확인해 보세요.
                </p>
                <div className="mt-5 space-y-3.5">
                  {[
                    {
                      icon: LuMousePointerClick,
                      title: "프로젝트 아이콘 선택",
                      description: "바탕화면에서 프로젝트를 바로 열 수 있어요.",
                    },
                    {
                      icon: LuSearch,
                      title: "이름 또는 기술 검색",
                      description: "하단 검색창에서 원하는 프로젝트를 찾아보세요.",
                    },
                    {
                      icon: LuLayoutGrid,
                      title: "작업표시줄에서 다시 열기",
                      description: "최소화한 프로젝트는 하단 아이콘으로 복원할 수 있어요.",
                    },
                  ].map((guide, index) => {
                    const GuideIcon = guide.icon;
                    return (
                      <div key={guide.title} className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 text-sky-100">
                          <GuideIcon size={13} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[6px] font-medium text-sky-200/55">
                              0{index + 1}
                            </span>
                            <p className="text-[8px] font-semibold text-white/90">
                              {guide.title}
                            </p>
                          </div>
                          <p className="mt-0.5 text-[6.5px] text-white/50">
                            {guide.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-5 border-t border-white/10 pt-3 text-[6.5px] text-white/45">
                  열린 창은 상단 버튼으로 최소화하거나 닫을 수 있습니다.
                </p>
              </section>
              <div className="absolute left-3 top-3 z-10 grid grid-cols-1 gap-3">
                {webProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    aria-label={`${project.title} 프로젝트 열기`}
                    onClick={(event) =>
                      handleTaskbarProjectClick(event, project.id)
                    }
                    className="group/icon flex w-[54px] flex-col items-center gap-1 rounded px-1 py-1.5 text-center text-white outline-none transition hover:bg-white/15 focus-visible:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/80"
                  >
                    <Image
                      src={project.image}
                      alt=""
                      width={34}
                      height={34}
                      className="size-[34px] rounded-[8px] object-cover shadow-[0_3px_8px_rgba(0,0,0,.28)] transition-transform group-hover/icon:scale-105"
                    />
                    <span className="max-w-full truncate text-[7px] leading-3 [text-shadow:0_1px_2px_rgba(0,0,0,.8)]">
                      {project.title}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[19] h-[4px] bg-[#101010]/96"
          />
          <div
            className="absolute inset-x-0 bottom-[4px] z-20 flex h-[24px] items-center bg-[#101010]/96 px-2 text-white shadow-[0_-1px_0_rgba(255,255,255,.08)]"
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
            {webProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                aria-label={`${project.title} 프로젝트 선택`}
                aria-pressed={
                  projectWindowRunning && selectedProjectId === project.id
                }
                onClick={(event) =>
                  handleTaskbarProjectClick(event, project.id)
                }
                className="relative grid h-full w-8 place-items-center transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-sky-300"
              >
                <Image
                  src={project.image}
                  alt=""
                  width={15}
                  height={15}
                  className="size-[15px] rounded-[3px] object-cover"
                />
                {projectWindowRunning && selectedProjectId === project.id && (
                  <span className="absolute bottom-0 h-px w-5 bg-sky-400" />
                )}
              </button>
            ))}
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
