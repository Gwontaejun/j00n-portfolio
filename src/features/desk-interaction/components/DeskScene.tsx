"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { MathUtils, MOUSE, Vector3 } from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ModelAsset } from "./ModelAsset";
import { DeskAccessories } from "./DeskAccessories";
import { Monitor } from "./Monitor";
import { Phone } from "./Phone";
import { RoomEnvironment } from "./RoomEnvironment";
import { CopyHolder } from "./CopyHolder";
import { ResumeViewer } from "./ResumeViewer";
import type { ProjectCategory } from "@/types/project";
import { CAMERA_POSITION, CAMERA_TARGET, DESK_BASE_Y } from "../model/scene";

function Workspace({
  onSelect,
  cameraControlsEnabled,
  monitorFocused,
  phoneFocused,
  onFocusMonitor,
  onFocusPhone,
  onOpenResume,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  cameraControlsEnabled: boolean;
  monitorFocused: boolean;
  phoneFocused: boolean;
  onFocusMonitor: () => void;
  onFocusPhone: () => void;
  onOpenResume: () => void;
}) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraTransitioning = useRef(false);

  const defaultPosition = useRef(new Vector3(...CAMERA_POSITION));
  const defaultTarget = useRef(new Vector3(...CAMERA_TARGET));
  const monitorPosition = useRef(new Vector3(0, 2.08, 1.2));
  const monitorTarget = useRef(new Vector3(0, 2.1, -0.5));

  useFrame((_, delta) => {
    if (monitorFocused) cameraTransitioning.current = true;

    const controls = controlsRef.current;
    const shouldAnimate =
      monitorFocused || cameraTransitioning.current || (!cameraControlsEnabled && !phoneFocused);
    if (controls) controls.enabled = !phoneFocused && !shouldAnimate && cameraControlsEnabled;
    if (!shouldAnimate) return;

    const position = monitorFocused
      ? monitorPosition.current
      : defaultPosition.current;
    const target = monitorFocused
      ? monitorTarget.current
      : defaultTarget.current;
    const transitionSpeed = monitorFocused ? 2 : 2.8;
    const easing =
      1 - Math.exp(-MathUtils.clamp(delta, 0, 0.1) * transitionSpeed);
    camera.position.lerp(position, easing);
    controls?.target.lerp(target, easing);
    camera.lookAt(controls?.target ?? target);

    const transitionSettled =
      camera.position.distanceToSquared(position) < 0.0001 &&
      (!controls || controls.target.distanceToSquared(target) < 0.0001);

    if (transitionSettled) {
      camera.position.copy(position);
      controls?.target.copy(target);
      camera.lookAt(target);

      if (!monitorFocused && !phoneFocused) {
        cameraTransitioning.current = false;
        if (controls) {
          controls.enabled = cameraControlsEnabled;
          controls.update();
        }
      }
      return;
    }

    invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.09} color="#cbd7e5" />
      <directionalLight
        position={[0, 7, 0.8]}
        color="#d9e1eb"
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <pointLight
        position={[2.8, 2.2, 3]}
        color="#8cbcf0"
        intensity={0.9}
        distance={8}
      />
      <Environment resolution={64}>
        <Lightformer
          intensity={1.2}
          color="#d8e1ec"
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          intensity={0.4}
          color="#a8d1ff"
          position={[4, 2, 4]}
          scale={[3, 2, 1]}
        />
        <Lightformer
          intensity={0.25}
          color="#ffffff"
          position={[0, 5, -4]}
          scale={[6, 2, 1]}
        />
      </Environment>

      <RoomEnvironment />

      <group position={[0, DESK_BASE_Y, 0]}>
        <ModelAsset path="/3d-models/computer-desk.glb" size={6.2} />
      </group>
      <DeskAccessories />
      <CopyHolder
        interactionDisabled={monitorFocused || phoneFocused}
        onSelect={() => {
          if (!monitorFocused && !phoneFocused) onOpenResume();
        }}
      />
      <Phone
        focused={phoneFocused}
        interactionDisabled={monitorFocused}
        onFocus={onFocusPhone}
        onSelect={(projectId) => onSelect("app", projectId)}
      />
      <Monitor
        focused={monitorFocused}
        foregroundObjectActive={phoneFocused}
        onClick={() => {
          if (!phoneFocused) onFocusMonitor();
        }}
      />

      <ContactShadows
        position={[0, DESK_BASE_Y - 0.01, 0]}
        scale={9}
        opacity={0.55}
        blur={2.2}
        far={4.5}
        color="#050608"
        frames={1}
      />
      <OrbitControls
        ref={controlsRef}
        enabled={false}
        enableRotate={cameraControlsEnabled && !monitorFocused && !phoneFocused}
        enablePan={cameraControlsEnabled && !monitorFocused && !phoneFocused}
        enableZoom={cameraControlsEnabled && !monitorFocused && !phoneFocused}
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

function SceneBranding({ hidden, onReveal }: { hidden: boolean; onReveal: () => void }) {
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
            transition={{ duration: reduceMotion ? 0.1 : 0.7, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-[20000000] grid place-items-center bg-[radial-gradient(circle_at_50%_42%,#18202a_0%,#0b0e13_48%,#06080b_100%)] text-white"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p
                aria-label="J00N"
                className="inline-flex items-baseline text-4xl font-semibold tracking-[-0.06em] sm:text-6xl"
              >
                <span aria-hidden="true">{"J00N".slice(0, typedCharacterCount)}</span>
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
                className="mt-2 text-[10px] tracking-[0.52em] text-white/45 sm:text-[11px]"
              >
                PORTFOLIO
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
            className="pointer-events-none absolute left-5 top-5 z-[20000000] text-center text-white sm:left-8 sm:top-8"
          >
            <p className="text-[38px] font-semibold leading-none tracking-[-0.06em]">J00N</p>
            <p className="mt-[5px] text-[7px] tracking-[0.52em] text-white/42">PORTFOLIO</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DeskScene({
  onSelect,
  cameraControlsEnabled,
  onMonitorFocusChange,
  onSceneReady,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  cameraControlsEnabled: boolean;
  onMonitorFocusChange: (focused: boolean) => void;
  onSceneReady: () => void;
}) {
  const [monitorFocused, setMonitorFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
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
        setResumeOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    onMonitorFocusChange(monitorFocused || phoneFocused);
  }, [monitorFocused, phoneFocused, onMonitorFocusChange]);

  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_32%,#252c38_0%,#101319_48%,#080a0e_100%)]">
      <Canvas
        frameloop="demand"
        dpr={1}
        shadows
        camera={{ position: CAMERA_POSITION, fov: 41 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
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
            cameraControlsEnabled={cameraControlsEnabled}
            monitorFocused={monitorFocused}
            phoneFocused={phoneFocused}
            onFocusMonitor={() => {
              setPhoneFocused(false);
              setMonitorFocused(true);
            }}
            onFocusPhone={() => {
              setMonitorFocused(false);
              setPhoneFocused(true);
            }}
            onOpenResume={() => {
              setResumeOpen(true);
            }}
          />
        </Suspense>
      </Canvas>
      <AnimatePresence>
        {resumeOpen && <ResumeViewer onClose={() => setResumeOpen(false)} />}
      </AnimatePresence>
      <SceneBranding
        hidden={monitorFocused || phoneFocused || resumeOpen}
        onReveal={() => {
          setSceneVisible(true);
          onSceneReady();
        }}
      />
      {(monitorFocused || phoneFocused) && (
        <>
          <button
            type="button"
            aria-label="책상으로 돌아가기"
            onClick={() => {
              setMonitorFocused(false);
              setPhoneFocused(false);
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
