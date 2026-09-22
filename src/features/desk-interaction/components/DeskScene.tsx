"use client";

/* eslint-disable react-hooks/immutability -- React Three Fiber updates cameras and Object3D refs imperatively per frame. */

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Group, MathUtils, MOUSE, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { AnimatePresence } from "framer-motion";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ModelAsset } from "./ModelAsset";
import { DeskAccessories, DeskMoodLamp } from "./DeskAccessories";
import { Monitor } from "./Monitor";
import { Phone, type PhoneForegroundTransform } from "./Phone";
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

type CameraSnapshot = {
  position: Vector3;
  quaternion: Quaternion;
  fov: number;
  near: number;
  far: number;
};

function CameraSnapshotRecorder({ snapshot }: { snapshot: { current: CameraSnapshot } }) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);

  useFrame(() => {
    snapshot.current.position.copy(camera.position);
    snapshot.current.quaternion.copy(camera.quaternion);
    snapshot.current.fov = camera.fov;
    snapshot.current.near = camera.near;
    snapshot.current.far = camera.far;
  }, -2);

  return null;
}

function ForegroundPhone({
  cameraSnapshot,
  transform,
}: {
  cameraSnapshot: { current: CameraSnapshot };
  transform: { current: PhoneForegroundTransform };
}) {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const modelRef = useRef<Group>(null);

  useFrame(() => {
    const snapshot = cameraSnapshot.current;
    camera.position.copy(snapshot.position);
    camera.quaternion.copy(snapshot.quaternion);
    camera.fov = snapshot.fov;
    camera.near = snapshot.near;
    camera.far = snapshot.far;
    camera.updateProjectionMatrix();

    const model = modelRef.current;
    if (!model) return;
    model.position.copy(transform.current.position);
    model.quaternion.copy(transform.current.quaternion);
    model.scale.copy(transform.current.scale);
    model.visible = true;
  }, -1);

  return (
    <group ref={modelRef} visible={false}>
      <ModelAsset path="/3d-models/phone.glb" size={0.74} castShadow={false} />
    </group>
  );
}

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
  phoneForegroundTransformRef,
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
  phoneForegroundTransformRef: { current: PhoneForegroundTransform };
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
      2.228,
      WORKSPACE_OFFSET[2] + 1.39,
    ),
  );
  const monitorTarget = useRef(
    new Vector3(
      WORKSPACE_OFFSET[0] + DESKTOP_ITEMS_OFFSET_X,
      2.25,
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
            foregroundTransformRef={phoneForegroundTransformRef}
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

export function DeskScene({
  onSelect,
  onMonitorFocusChange,
  onSceneReady,
  visible,
  guideTarget,
}: {
  onSelect: (category: ProjectCategory, projectId?: string) => void;
  onMonitorFocusChange: (focused: boolean) => void;
  onSceneReady: () => void;
  visible: boolean;
  guideTarget: SceneGuideTarget | null;
}) {
  const [monitorFocused, setMonitorFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [guestbookFocused, setGuestbookFocused] = useState(false);
  const [guestbookComposerOpen, setGuestbookComposerOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const { active: assetsLoading, progress: assetProgress } = useProgress();
  const sceneReadyReportedRef = useRef(false);
  const cameraSnapshotRef = useRef<CameraSnapshot>({
    position: new Vector3(...CAMERA_POSITION),
    quaternion: new Quaternion(),
    fov: 41,
    near: 0.1,
    far: 1000,
  });
  const phoneForegroundTransformRef = useRef<PhoneForegroundTransform>({
    position: new Vector3(),
    quaternion: new Quaternion(),
    scale: new Vector3(1, 1, 1),
  });
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

  useEffect(() => {
    if (
      sceneReadyReportedRef.current ||
      assetsLoading ||
      assetProgress < 100
    ) {
      return;
    }

    sceneReadyReportedRef.current = true;
    const frame = window.requestAnimationFrame(onSceneReady);
    return () => window.cancelAnimationFrame(frame);
  }, [assetProgress, assetsLoading, onSceneReady]);

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
          opacity: visible ? 1 : 0,
          transition: `opacity ${visible ? 500 : 0}ms ease-out`,
        }}
      >
        <CameraSnapshotRecorder snapshot={cameraSnapshotRef} />
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
            phoneForegroundTransformRef={phoneForegroundTransformRef}
          />
        </Suspense>
      </Canvas>
      {phoneFocused && visible && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[500]"
        >
          <Canvas
            frameloop="always"
            dpr={1}
            camera={{ position: CAMERA_POSITION, fov: 41 }}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={1.15} />
            <directionalLight position={[-2, 5, 4]} intensity={1.25} />
            <Suspense fallback={null}>
              <ForegroundPhone
                cameraSnapshot={cameraSnapshotRef}
                transform={phoneForegroundTransformRef}
              />
            </Suspense>
          </Canvas>
        </div>
      )}
      <AnimatePresence>
        {resumeOpen && <ResumeViewer onClose={() => setResumeOpen(false)} />}
      </AnimatePresence>
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
