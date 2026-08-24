"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { MathUtils, MOUSE, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ModelAsset } from "./ModelAsset";
import { DeskAccessories } from "./DeskAccessories";
import { Monitor } from "./Monitor";
import { Phone } from "./Phone";
import { RoomEnvironment } from "./RoomEnvironment";
import { WelcomeHint } from "./WelcomeHint";
import type { ProjectCategory } from "@/types/project";
import { CAMERA_POSITION, CAMERA_TARGET, DESK_BASE_Y } from "../model/scene";

function Workspace({
  onSelect,
  cameraControlsEnabled,
  monitorFocused,
  onFocusMonitor,
  onReady,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  cameraControlsEnabled: boolean;
  monitorFocused: boolean;
  onFocusMonitor: () => void;
  onReady: () => void;
}) {
  const camera = useThree((state) => state.camera);
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
      monitorFocused || cameraTransitioning.current || !cameraControlsEnabled;
    if (controls) controls.enabled = !shouldAnimate && cameraControlsEnabled;
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

    if (
      !monitorFocused &&
      camera.position.distanceToSquared(defaultPosition.current) < 0.0001 &&
      (!controls ||
        controls.target.distanceToSquared(defaultTarget.current) < 0.0001)
    ) {
      camera.position.copy(defaultPosition.current);
      controls?.target.copy(defaultTarget.current);
      cameraTransitioning.current = false;
      if (controls) {
        controls.enabled = cameraControlsEnabled;
        controls.update();
      }
    }
  });

  useEffect(() => onReady(), [onReady]);

  return (
    <>
      <ambientLight intensity={0.3} color="#dce6f4" />
      <directionalLight
        position={[0, 7, 0.8]}
        color="#fff0dc"
        intensity={4.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <pointLight
        position={[2.8, 2.2, 3]}
        color="#8cbcf0"
        intensity={3.5}
        distance={8}
      />
      <Environment resolution={128}>
        <Lightformer
          intensity={3.5}
          color="#fff0dc"
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          intensity={1.2}
          color="#a8d1ff"
          position={[4, 2, 4]}
          scale={[3, 2, 1]}
        />
        <Lightformer
          intensity={0.8}
          color="#ffffff"
          position={[0, 5, -4]}
          scale={[6, 2, 1]}
        />
      </Environment>

      <RoomEnvironment />

      <group position={[0, DESK_BASE_Y, 0]}>
        <ModelAsset path="/3d-models/computer-desk.glb" size={6.2} />
      </group>
      <Monitor focused={monitorFocused} onClick={onFocusMonitor} />
      <DeskAccessories />
      <Phone onSelect={(projectId) => onSelect("app", projectId)} />

      <ContactShadows
        position={[0, DESK_BASE_Y - 0.01, 0]}
        scale={9}
        opacity={0.55}
        blur={2.2}
        far={4.5}
        color="#050608"
      />
      <OrbitControls
        ref={controlsRef}
        enabled={false}
        enableRotate={cameraControlsEnabled && !monitorFocused}
        enablePan={cameraControlsEnabled && !monitorFocused}
        enableZoom={cameraControlsEnabled && !monitorFocused}
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

export function DeskScene({
  onSelect,
  cameraControlsEnabled,
  onMonitorFocusChange,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  cameraControlsEnabled: boolean;
  onMonitorFocusChange: (focused: boolean) => void;
}) {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [monitorFocused, setMonitorFocused] = useState(false);
  const showWelcome = useCallback(() => setWelcomeVisible(true), []);
  const handleSelect = useCallback(
    (category: ProjectCategory, projectId?: string) => {
      setWelcomeVisible(false);
      onSelect(category, projectId);
    },
    [onSelect],
  );

  useEffect(() => {
    if (!welcomeVisible) return;
    const timer = window.setTimeout(() => setWelcomeVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [welcomeVisible]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMonitorFocused(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    onMonitorFocusChange(monitorFocused);
  }, [monitorFocused, onMonitorFocusChange]);

  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_32%,#252c38_0%,#101319_48%,#080a0e_100%)]">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: CAMERA_POSITION, fov: 41 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#080a0e", 8, 14]} />
        <Suspense fallback={null}>
          <Workspace
            onSelect={handleSelect}
            cameraControlsEnabled={cameraControlsEnabled}
            monitorFocused={monitorFocused}
            onFocusMonitor={() => {
              setWelcomeVisible(false);
              setMonitorFocused(true);
            }}
            onReady={showWelcome}
          />
        </Suspense>
      </Canvas>
      {monitorFocused && (
        <>
          <button
            type="button"
            aria-label="책상으로 돌아가기"
            onClick={() => setMonitorFocused(false)}
            className="absolute left-5 top-5 z-30 grid size-10 place-items-center text-2xl text-white/65 transition hover:-translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 sm:left-8 sm:top-8"
          >
            <span aria-hidden="true">←</span>
          </button>
          <p className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap px-4 py-2 text-xs text-white/55">
            ESC 키 또는 좌측 상단 버튼을 누르면 책상으로 돌아갑니다.
          </p>
        </>
      )}
      <WelcomeHint
        visible={welcomeVisible}
        onDismiss={() => setWelcomeVisible(false)}
      />
    </div>
  );
}

useGLTF.preload("/3d-models/computer-desk.glb");
