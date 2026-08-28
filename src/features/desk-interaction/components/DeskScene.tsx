"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { MathUtils, MOUSE, Vector3 } from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ModelAsset } from "./ModelAsset";
import { DeskAccessories, DeskMoodLamp } from "./DeskAccessories";
import { Monitor } from "./Monitor";
import { Phone } from "./Phone";
import { RoomEnvironment } from "./RoomEnvironment";
import { ProfileBoard } from "./ProfileBoard";
import { ResumeViewer } from "./ResumeViewer";
import { GuideSceneRenderer } from "./GuideSceneRenderer";
import type { ProjectCategory } from "@/types/project";
import type { SceneGuideTarget } from "@/types/scene-guide";
import {
  CAMERA_POSITION,
  CAMERA_TARGET,
  DESK_BASE_Y,
  DESKTOP_ITEMS_OFFSET_X,
  WORKSPACE_OFFSET,
} from "../model/scene";

function Workspace({
  onSelect,
  monitorFocused,
  phoneFocused,
  guestbookFocused,
  onFocusMonitor,
  onFocusPhone,
  onOpenResume,
  onFocusGuestbook,
  onOpenGuestbook,
  onCloseGuestbookComposer,
  guestbookComposerOpen,
  guideTarget,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  monitorFocused: boolean;
  phoneFocused: boolean;
  guestbookFocused: boolean;
  onFocusMonitor: () => void;
  onFocusPhone: () => void;
  onOpenResume: () => void;
  onFocusGuestbook: () => void;
  onOpenGuestbook: () => void;
  onCloseGuestbookComposer: () => void;
  guestbookComposerOpen: boolean;
  guideTarget: SceneGuideTarget | null;
}) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraTransitioning = useRef(false);

  const defaultPosition = useRef(new Vector3(...CAMERA_POSITION));
  const defaultTarget = useRef(new Vector3(...CAMERA_TARGET));
  const monitorPosition = useRef(
    new Vector3(
      WORKSPACE_OFFSET[0] + DESKTOP_ITEMS_OFFSET_X,
      2.08,
      WORKSPACE_OFFSET[2] + 1.2,
    ),
  );
  const monitorTarget = useRef(
    new Vector3(
      WORKSPACE_OFFSET[0] + DESKTOP_ITEMS_OFFSET_X,
      2.1,
      WORKSPACE_OFFSET[2] - 0.5,
    ),
  );
  const guestbookPosition = useRef(new Vector3(-3.35, 2.05, -1.45));
  const guestbookTarget = useRef(new Vector3(-6.12, 2.05, -1.45));

  useFrame((_, delta) => {
    if (monitorFocused || guestbookFocused) cameraTransitioning.current = true;

    const controls = controlsRef.current;
    const shouldAnimate =
      monitorFocused ||
      guestbookFocused ||
      cameraTransitioning.current ||
      !phoneFocused;
    if (controls) {
      controls.enabled = false;
    }
    if (!shouldAnimate) return;

    const position = monitorFocused
      ? monitorPosition.current
      : guestbookFocused
        ? guestbookPosition.current
        : defaultPosition.current;
    const target = monitorFocused
      ? monitorTarget.current
      : guestbookFocused
        ? guestbookTarget.current
        : defaultTarget.current;
    const transitionSpeed = monitorFocused || guestbookFocused ? 2 : 2.8;
    const easing =
      1 - Math.exp(-MathUtils.clamp(delta, 0, 0.1) * transitionSpeed);
    camera.position.lerp(position, easing);
    controls?.target.lerp(target, easing);
    camera.lookAt(controls?.target ?? target);

    const transitionSettled =
      camera.position.distanceToSquared(position) < 0.0001 &&
      (!controls || controls.target.distanceToSquared(target) < 0.0001);

    if (transitionSettled) {
      if (!monitorFocused && !phoneFocused && !guestbookFocused) {
        cameraTransitioning.current = false;
        if (controls) {
          controls.enabled = false;
          controls.update();
        }
      }
      return;
    }

    invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.34} color="#b8c2cb" />
      <directionalLight
        position={[0, 4.8, -3.15]}
        color="#9fb9d2"
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <RoomEnvironment />

      <ProfileBoard
        interactionDisabled={monitorFocused || phoneFocused}
        guestbookComposerOpen={guestbookComposerOpen}
        profileGuideDimmed={guideTarget !== null && guideTarget !== "profile"}
        profileGuideHighlighted={guideTarget === "profile"}
        guestbookGuideDimmed={
          guideTarget !== null && guideTarget !== "guestbook"
        }
        onSelect={() => {
          if (!monitorFocused && !phoneFocused) onOpenResume();
        }}
        onFocusGuestbook={onFocusGuestbook}
        onOpenGuestbook={onOpenGuestbook}
        onCloseGuestbookComposer={onCloseGuestbookComposer}
      />

      <group position={WORKSPACE_OFFSET}>
        <group position={[0, DESK_BASE_Y, 0]}>
          <ModelAsset path="/3d-models/computer-desk.glb" size={6.2} />
        </group>
        <DeskMoodLamp />
        <group position={[DESKTOP_ITEMS_OFFSET_X, 0, 0]}>
          <DeskAccessories />
          <Phone
            focused={phoneFocused}
            interactionDisabled={monitorFocused || guestbookFocused}
            guideHighlighted={guideTarget === "phone"}
            guideDimmed={guideTarget !== null && guideTarget !== "phone"}
            onFocus={onFocusPhone}
            onSelect={(projectId) => onSelect("app", projectId)}
          />
          <Monitor
            focused={monitorFocused}
            foregroundObjectActive={phoneFocused || guestbookFocused}
            guideHighlighted={guideTarget === "monitor"}
            guideDimmed={guideTarget !== null && guideTarget !== "monitor"}
            onClick={() => {
              if (!phoneFocused && !guestbookFocused) onFocusMonitor();
            }}
          />
        </group>

        <ContactShadows
          position={[0, DESK_BASE_Y - 0.01, 0]}
          scale={9}
          opacity={0.55}
          blur={2.2}
          far={4.5}
          color="#050608"
          frames={1}
        />
      </group>

      {guideTarget && <GuideSceneRenderer active />}
      <OrbitControls
        ref={controlsRef}
        enabled={false}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        panSpeed={0.75}
        screenSpacePanning
        enableDamping
        dampingFactor={0.07}
        minDistance={5.2}
        maxDistance={8.2}
        minPolarAngle={0.78}
        maxPolarAngle={1.38}
        target={CAMERA_TARGET}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
      />
    </>
  );
}
useGLTF.preload("/3d-models/computer-desk.glb");

function SceneBranding({
  hidden,
  onReveal,
}: {
  hidden: boolean;
  onReveal: () => void;
}) {
  const { active, progress } = useProgress();
  const reduceMotion = useReducedMotion();
  const [splashVisible, setSplashVisible] = useState(true);
  const [exitComplete, setExitComplete] = useState(false);
  const [typedCharacterCount, setTypedCharacterCount] = useState(0);

  useEffect(() => {
    if (active || progress < 100) return;

    const characterDelay = reduceMotion ? 0 : 400;
    const typingStartDelay = reduceMotion ? 0 : 180;
    const timers = Array.from({ length: 4 }, (_, index) =>
      window.setTimeout(
        () => setTypedCharacterCount(index + 1),
        typingStartDelay + index * characterDelay,
      ),
    );
    const hideTimer = window.setTimeout(
      () => setSplashVisible(false),
      reduceMotion ? 100 : typingStartDelay + characterDelay * 3 + 1450,
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(hideTimer);
    };
  }, [active, progress, reduceMotion]);

  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          setExitComplete(true);
          onReveal();
        }}
      >
        {splashVisible && (
          <motion.div
            aria-live="polite"
            aria-label={`포트폴리오 로딩 중 ${roundedProgress}%`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.7,
              ease: "easeInOut",
            }}
            className="pointer-events-auto absolute inset-0 z-[20000000] grid place-items-center bg-[radial-gradient(circle_at_50%_42%,#18202a_0%,#0b0e13_48%,#06080b_100%)] text-white"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-max flex-col items-center text-center"
            >
              <p
                aria-label="J00N"
                className="inline-flex items-baseline text-4xl font-semibold tracking-[-0.06em] sm:text-6xl"
              >
                <span aria-hidden="true">
                  {"J00N".slice(0, typedCharacterCount)}
                </span>
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: reduceMotion ? 0 : 1 }}
                  animate={{ opacity: reduceMotion ? 0 : [1, 1, 0, 0] }}
                  transition={{
                    duration: 0.85,
                    delay: reduceMotion ? 0 : 0.95,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "linear",
                  }}
                  className="ml-1 inline-block h-[0.78em] w-[2px] bg-white/75 sm:w-[3px]"
                />
              </p>
              <motion.p
                aria-hidden={typedCharacterCount !== 4}
                initial={false}
                animate={{
                  opacity: typedCharacterCount === 4 ? 1 : 0,
                  y: typedCharacterCount === 4 ? 0 : 3,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: !reduceMotion && typedCharacterCount === 4 ? 0.3 : 0,
                }}
                className="mt-2 text-center text-[12px] font-medium tracking-[0.18em] text-white/55 [text-indent:0.18em] sm:text-[13px]"
              >
                Frontend Developer
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exitComplete && !hidden && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.4 }}
            className="pointer-events-none absolute left-5 top-5 z-[20000000] flex w-max flex-col items-center text-center text-white sm:left-8 sm:top-8"
          >
            <p className="text-[38px] font-semibold leading-none tracking-[-0.06em]">
              J00N
            </p>
            <p className="mt-1.5 whitespace-nowrap text-center text-[9px] font-medium tracking-[0.16em] text-white/52 [text-indent:0.16em]">
              Frontend Developer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DeskScene({
  onSelect,
  onMonitorFocusChange,
  onSceneReady,
  guideTarget,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  onMonitorFocusChange: (focused: boolean) => void;
  onSceneReady: () => void;
  guideTarget: SceneGuideTarget | null;
}) {
  const [monitorFocused, setMonitorFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [guestbookFocused, setGuestbookFocused] = useState(false);
  const [guestbookComposerOpen, setGuestbookComposerOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const handleSelect = useCallback(
    (category: ProjectCategory, projectId?: string) => {
      onSelect(category, projectId);
    },
    [onSelect],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMonitorFocused(false);
        setPhoneFocused(false);
        setGuestbookFocused(false);
        setGuestbookComposerOpen(false);
        setResumeOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    onMonitorFocusChange(monitorFocused || phoneFocused || guestbookFocused);
  }, [monitorFocused, phoneFocused, guestbookFocused, onMonitorFocusChange]);

  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_32%,#252c38_0%,#101319_48%,#080a0e_100%)]">
      <Canvas
        frameloop="demand"
        dpr={1}
        shadows
        camera={{ position: CAMERA_POSITION, fov: 41 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.autoUpdate = false;
          gl.shadowMap.needsUpdate = true;
        }}
        style={{
          opacity: sceneVisible ? 1 : 0,
          transition: `opacity ${sceneVisible ? 500 : 0}ms ease-out`,
        }}
      >
        <fog attach="fog" args={["#080a0e", 8, 14]} />
        <Suspense fallback={null}>
          <Workspace
            onSelect={handleSelect}
            monitorFocused={monitorFocused}
            phoneFocused={phoneFocused}
            guestbookFocused={guestbookFocused}
            guestbookComposerOpen={guestbookComposerOpen}
            onFocusMonitor={() => {
              setPhoneFocused(false);
              setGuestbookFocused(false);
              setGuestbookComposerOpen(false);
              setMonitorFocused(true);
            }}
            onFocusPhone={() => {
              setMonitorFocused(false);
              setGuestbookFocused(false);
              setGuestbookComposerOpen(false);
              setPhoneFocused(true);
            }}
            onOpenResume={() => {
              setResumeOpen(true);
            }}
            onFocusGuestbook={() => {
              setMonitorFocused(false);
              setPhoneFocused(false);
              setGuestbookFocused(true);
              setGuestbookComposerOpen(false);
            }}
            onOpenGuestbook={() => {
              if (!guestbookFocused) {
                setMonitorFocused(false);
                setPhoneFocused(false);
                setGuestbookFocused(true);
                setGuestbookComposerOpen(false);
                return;
              }

              setGuestbookComposerOpen(true);
            }}
            onCloseGuestbookComposer={() => setGuestbookComposerOpen(false)}
            guideTarget={guideTarget}
          />
        </Suspense>
      </Canvas>
      <AnimatePresence>
        {resumeOpen && <ResumeViewer onClose={() => setResumeOpen(false)} />}
      </AnimatePresence>
      <SceneBranding
        hidden={
          monitorFocused || phoneFocused || guestbookFocused || resumeOpen
        }
        onReveal={() => {
          setSceneVisible(true);
          onSceneReady();
        }}
      />
      {(monitorFocused || phoneFocused || guestbookFocused) && (
        <>
          <button
            type="button"
            aria-label="책상으로 돌아가기"
            onClick={() => {
              setMonitorFocused(false);
              setPhoneFocused(false);
              setGuestbookFocused(false);
              setGuestbookComposerOpen(false);
            }}
            className="absolute left-5 top-5 z-[20000000] grid size-10 cursor-pointer place-items-center text-2xl text-white/65 transition hover:-translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 sm:left-8 sm:top-8"
          >
            <span aria-hidden="true">←</span>
          </button>
          <p className="pointer-events-none absolute bottom-3 left-1/2 z-[20000000] -translate-x-1/2 whitespace-nowrap px-4 py-2 text-xs text-white/55">
            ESC 키 또는 좌측 상단 화살표를 누르면 책상으로 돌아갑니다.
          </p>
        </>
      )}
    </div>
  );
}
