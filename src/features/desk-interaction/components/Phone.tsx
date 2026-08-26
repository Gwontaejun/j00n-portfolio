"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import {
  LuBatteryFull,
  LuCalendarDays,
  LuCircle,
  LuChartBar,
  LuEye,
  LuListChecks,
  LuMic,
  LuSearch,
  LuSquare,
  LuTimer,
  LuTriangle,
  LuWifi,
} from "react-icons/lu";
import { SiExpo, SiGithub, SiReact, SiTypescript } from "react-icons/si";
import { Euler, Group, Matrix4, Quaternion, Vector3 } from "three";
import { ModelAsset } from "./ModelAsset";
import { DESK_TOP_Y } from "../model/scene";
import { useCurrentDateTime } from "@/shared/hooks/useCurrentDateTime";
import { duckRoutineProject } from "@/data/projects";
import { useGuideHighlight } from "../hooks/useGuideHighlight";

type PhoneProps = {
  focused: boolean;
  interactionDisabled?: boolean;
  guideHighlighted?: boolean;
  guideDimmed?: boolean;
  onFocus: () => void;
  onSelect: (projectId?: string) => void;
};

const DUCK_FEATURE_ICONS = [LuListChecks, LuTimer, LuCalendarDays, LuChartBar];
const DUCK_FEATURE_COLORS = [
  "bg-orange-400/10 text-orange-300",
  "bg-sky-400/10 text-sky-300",
  "bg-emerald-400/10 text-emerald-300",
  "bg-violet-400/10 text-violet-300",
];

export function Phone({
  focused,
  interactionDisabled = false,
  guideHighlighted = false,
  guideDimmed = false,
  onFocus,
  onSelect,
}: PhoneProps) {
  const [hovered, setHovered] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"home" | "duck-routine">("home");
  const currentDateTime = useCurrentDateTime();
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const rootRef = useRef<Group>(null);
  const phoneRef = useRef<Group>(null);
  const cameraDirection = useRef(new Vector3());
  const cameraUp = useRef(new Vector3());
  const screenRight = useRef(new Vector3());
  const screenNormal = useRef(new Vector3());
  const screenUp = useRef(new Vector3());
  const screenBack = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());
  const restingPosition = useRef(new Vector3(0, 0.51, -0.02));
  const rotationMatrix = useRef(new Matrix4());
  const rootWorldQuaternion = useRef(new Quaternion());
  const phoneWorldPosition = useRef(new Vector3());
  const phoneWorldQuaternion = useRef(new Quaternion());
  const phoneScreenNormal = useRef(new Vector3());
  const phoneCameraDirection = useRef(new Vector3());
  const [frontFacing, setFrontFacing] = useState(true);
  const frontFacingRef = useRef(true);
  const targetWorldQuaternion = useRef(new Quaternion());
  const targetLocalQuaternion = useRef(new Quaternion());
  const restingQuaternion = useRef(
    new Quaternion().setFromEuler(new Euler(0.95, 0, 0)),
  );
  useGuideHighlight(rootRef, guideHighlighted);
  useFrame((_, delta) => {
    const root = rootRef.current;
    const phone = phoneRef.current;
    if (!root || !phone) return;

    if (focused) {
      camera.getWorldDirection(cameraDirection.current);
      targetPosition.current
        .copy(camera.position)
        .addScaledVector(cameraDirection.current, 2.8);

      screenNormal.current.copy(cameraDirection.current).negate().normalize();
      cameraUp.current.copy(camera.up).applyQuaternion(camera.quaternion).normalize();
      screenUp.current
        .copy(cameraUp.current)
        .addScaledVector(
          screenNormal.current,
          -cameraUp.current.dot(screenNormal.current),
        )
        .normalize();
      screenRight.current
        .crossVectors(screenUp.current, screenNormal.current)
        .normalize();
      screenBack.current.copy(screenUp.current).negate();
      rotationMatrix.current.makeBasis(
        screenRight.current,
        screenNormal.current,
        screenBack.current,
      );
      targetWorldQuaternion.current.setFromRotationMatrix(rotationMatrix.current);
      root.getWorldQuaternion(rootWorldQuaternion.current);
      targetLocalQuaternion.current
        .copy(rootWorldQuaternion.current)
        .invert()
        .multiply(targetWorldQuaternion.current);

      root.worldToLocal(targetPosition.current);
    } else {
      targetPosition.current.copy(restingPosition.current);
      targetLocalQuaternion.current.copy(restingQuaternion.current);
    }

    const easing = 1 - Math.exp(-Math.min(delta, 0.1) * (focused ? 2.4 : 3));
    phone.position.lerp(targetPosition.current, easing);
    const targetScale = focused ? 2.2 : 1;
    const nextScale = phone.scale.x + (targetScale - phone.scale.x) * easing;
    phone.scale.setScalar(nextScale);
    phone.quaternion.slerp(targetLocalQuaternion.current, easing);

    // Drei의 Html이 같은 프레임에서 갱신된 휴대폰 행렬을 읽도록 먼저 확정한다.
    // 그렇지 않으면 빠르게 이동할 때 DOM 화면이 한 프레임 전 위치에 남아
    // WebGL 휴대폰 모델의 테두리 밖으로 밀려 보일 수 있다.
    phone.updateWorldMatrix(true, true);

    phone.getWorldPosition(phoneWorldPosition.current);
    phone.getWorldQuaternion(phoneWorldQuaternion.current);
    phoneScreenNormal.current
      .set(0, 1, 0)
      .applyQuaternion(phoneWorldQuaternion.current);
    phoneCameraDirection.current
      .copy(camera.position)
      .sub(phoneWorldPosition.current)
      .normalize();

    const nextFrontFacing =
      phoneScreenNormal.current.dot(phoneCameraDirection.current) > 0;
    if (nextFrontFacing !== frontFacingRef.current) {
      frontFacingRef.current = nextFrontFacing;
      setFrontFacing(nextFrontFacing);
    }

    const transitionSettled =
      phone.position.distanceToSquared(targetPosition.current) < 0.000001 &&
      Math.abs(phone.scale.x - targetScale) < 0.0001 &&
      phone.quaternion.angleTo(targetLocalQuaternion.current) < 0.0001;

    if (transitionSettled) {
      phone.position.copy(targetPosition.current);
      phone.scale.setScalar(targetScale);
      phone.quaternion.copy(targetLocalQuaternion.current);
      return;
    }

    invalidate();
  }, -1);

  return (
    <group
      ref={rootRef}
      position={[1.85, DESK_TOP_Y, -0.5]}
      rotation={[0, -0.28, 0]}
    >
      <ModelAsset path="/3d-models/phone-dock.glb" size={0.72} />
      <group
        ref={phoneRef}
        position={[0, 0.51, -0.02]}
        rotation={[0.95, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          if (interactionDisabled) return;
          if (focused) onSelect();
          else {
            setActiveScreen("home");
            onFocus();
          }
        }}
        onPointerEnter={() => {
          if (!focused && !interactionDisabled) document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <ModelAsset path="/3d-models/phone.glb" size={0.74} />
        <Html
          center
          transform
          position={[0, 0.034, 0.004]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={0.37}
          style={{
            pointerEvents: interactionDisabled ? "none" : "auto",
            display: frontFacing ? "block" : "none",
            contain: "layout paint style",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: guideDimmed ? "brightness(0.32)" : "none",
            transition: "filter 220ms ease",
          }}
        >
          <div
            role={focused ? undefined : "button"}
            tabIndex={focused ? -1 : 0}
            aria-label="휴대폰 앱 프로젝트 보기"
            onClick={(event) => {
              event.stopPropagation();
              if (!focused) {
                setHovered(false);
                document.body.style.cursor = "auto";
                onFocus();
              }
            }}
            onKeyDown={(event) => {
              if (!focused && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                setHovered(false);
                onFocus();
              }
            }}
            onPointerEnter={() => {
              if (!focused) {
                setHovered(true);
                document.body.style.cursor = "pointer";
              }
            }}
            onPointerLeave={() => {
              setHovered(false);
              document.body.style.cursor = "auto";
            }}
            onFocus={() => {
              if (!focused) setHovered(true);
            }}
            onBlur={() => setHovered(false)}
            style={{
              zoom: 2,
              WebkitFontSmoothing: "antialiased",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className={`relative flex h-[384px] w-[176px] flex-col overflow-hidden rounded-[10px] border border-white/[.07] bg-[#111318] px-3 pb-2 pt-2 text-white outline-none ${focused ? "cursor-default" : "cursor-pointer"}`}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -right-10 top-7 h-36 w-28 rotate-[28deg] rounded-[45%] bg-[#ff8a3d]/10 blur-md" />
              <span className="absolute -left-12 top-40 h-32 w-28 -rotate-[18deg] rounded-[42%] bg-[#d9b29a]/6 blur-md" />
            </div>

            <div className="relative z-10 flex h-4 items-center justify-between px-1 text-[7px] font-medium text-white/85">
              <span>{currentDateTime.time}</span>
              <span className="flex items-center gap-1 text-white/80">
                <LuWifi size={8} aria-hidden="true" />
                <LuBatteryFull size={10} aria-hidden="true" />
              </span>
            </div>

            <div className={`relative z-10 mt-2 grid-cols-4 ${activeScreen === "home" ? "grid" : "hidden"}`}>
              <button
                type="button"
                aria-label="Duck Routine 앱"
                onClick={(event) => {
                  event.stopPropagation();
                  if (focused) setActiveScreen("duck-routine");
                  else onFocus();
                }}
                className="group/app flex min-w-0 flex-col items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <Image
                  src={duckRoutineProject.image}
                  alt=""
                  width={34}
                  height={34}
                  quality={90}
                  className="size-[34px] rounded-[11px] object-cover transition duration-200 group-hover/app:-translate-y-0.5"
                />
                <span className="max-w-10 truncate text-[5.5px] text-white/85">
                  {duckRoutineProject.title}
                </span>
              </button>
            </div>

            {activeScreen === "duck-routine" && (
              <section className="relative z-10 mt-1 min-h-0 flex-1 overflow-y-auto px-0.5 pb-2 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="border-b border-white/[.08] px-0.5 pb-2.5 pt-1">
                  <div className="relative flex items-start gap-2">
                    <Image
                      src={duckRoutineProject.image}
                      alt="Duck Routine 앱 아이콘"
                      width={36}
                      height={36}
                      quality={100}
                      className="size-9 shrink-0 rounded-[10px] object-cover shadow-[0_5px_14px_rgba(0,0,0,.28)]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-1 text-[5px]">
                        <span className="size-1 rounded-full bg-amber-400" />
                        <span className="tracking-[.08em] text-amber-300/70">출시 준비 중</span>
                      </div>
                      <p className="text-[11px] font-semibold tracking-[-0.025em] text-white">
                        {duckRoutineProject.title}
                      </p>
                      <p className="mt-0.5 text-[6px] leading-[1.4] text-white/62">
                        {duckRoutineProject.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center gap-1">
                  <span className="inline-flex h-7 flex-1 items-center justify-center rounded-[7px] border border-white/[.07] text-[6px] font-medium text-white/32">
                    Play Store 심사 중
                  </span>
                  <a
                    href={duckRoutineProject.repositoryHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[7px] border border-white/[.12] bg-white/[.06] text-[6.5px] font-medium text-white/88 transition hover:border-white/20 hover:bg-white/[.1]"
                  >
                    <SiGithub size={8} aria-hidden="true" />
                    GitHub
                  </a>
                </div>

                <div className="mt-2">
                  <p className="text-[7.5px] font-semibold text-white/92">기술 스택</p>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    {[
                      { name: "Expo 54", icon: SiExpo, color: "text-white/80" },
                      { name: "React Native", icon: SiReact, color: "text-[#61dafb]" },
                      { name: "TypeScript", icon: SiTypescript, color: "text-[#5a9bd5]" },
                    ].map(({ name, icon: TechIcon, color }) => (
                      <div key={name} className="flex h-6 min-w-0 items-center justify-center gap-1 rounded-full border border-white/[.08] px-1 text-white/58">
                        <TechIcon size={8} className={color} aria-hidden="true" />
                        <span className="whitespace-nowrap text-[4.75px]">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 border-t border-white/[.07] pt-2">
                  <p className="text-[7.5px] font-semibold text-white/92">앱 소개</p>
                  <p className="mt-1 text-[6.5px] leading-[1.55] text-white/62">
                    {duckRoutineProject.description}
                  </p>
                </div>

                <div className="mt-2 border-t border-white/[.07] pt-2">
                  <p className="text-[7.5px] font-semibold text-white/92">주요 기능</p>
                  <div className="mt-1 divide-y divide-white/[.07] border-y border-white/[.07]">
                    {duckRoutineProject.features?.slice(0, 4).map((feature, index) => {
                      const FeatureIcon = DUCK_FEATURE_ICONS[index];
                      return (
                        <div key={feature.title} className="flex items-start gap-1.5 py-2">
                          <span className={`grid size-5 shrink-0 place-items-center rounded-[6px] ${DUCK_FEATURE_COLORS[index]}`}>
                            <FeatureIcon size={8} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-[6.5px] font-medium leading-tight text-white/90">{feature.title}</p>
                            <p className="mt-0.5 text-[5.5px] leading-[1.4] text-white/48">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </section>
            )}

            <div className="hidden">
              <p className="text-[9px] font-medium text-white/92">{currentDateTime.date}</p>
              <p className="mt-1 text-[7px] text-[#c4c8d6]">23° · 비가 오는 밤</p>
            </div>

            <div className="hidden">
              <LuSearch size={11} aria-hidden="true" />
              <span className="flex-1 text-left text-[7px]">검색</span>
              <LuMic size={10} aria-hidden="true" />
            </div>
            <div className="relative z-10 -mx-3 -mb-2 mt-auto flex h-7 shrink-0 items-center justify-around border-t border-white/[.04] bg-[#0d0f15] px-8 text-white/75">
              <button
                type="button"
                aria-label="최근 앱"
                onClick={(event) => event.stopPropagation()}
                className="grid size-6 cursor-pointer place-items-center"
              >
                <LuSquare size={9} strokeWidth={1.7} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="홈"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveScreen("home");
                }}
                className="grid size-6 cursor-pointer place-items-center"
              >
                <LuCircle size={10} strokeWidth={1.7} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="뒤로가기"
                onClick={(event) => {
                  event.stopPropagation();
                  if (activeScreen !== "home") setActiveScreen("home");
                }}
                className="grid size-6 cursor-pointer place-items-center"
              >
                <LuTriangle
                  size={10}
                  strokeWidth={1.7}
                  className="-rotate-90"
                  aria-hidden="true"
                />
              </button>
            </div>

            {!focused && (
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-[22px] transition-colors duration-300 ${hovered ? "bg-neutral-500/40" : "bg-transparent"}`}
              >
                <LuEye
                  size={72}
                  strokeWidth={1.4}
                  className={`text-white drop-shadow-[0_4px_12px_rgba(0,0,0,.55)] transition duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                />
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

useGLTF.preload("/3d-models/phone.glb");
useGLTF.preload("/3d-models/phone-dock.glb");
