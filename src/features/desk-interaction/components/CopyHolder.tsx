"use client";

import { useRef, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { LuEye } from "react-icons/lu";
import { Group, Quaternion, Vector3 } from "three";
import { ModelAsset } from "./ModelAsset";
import { DESK_TOP_Y } from "../model/scene";
import { RESUME_EMBED_URL } from "../model/resume";

const PAPER_HOLDER_MODEL = "/3d-models/paper-holder.glb";
const HOLDER_CAMERA_YAW = 1.3;
const HOLDER_FORWARD_TILT = 0.068;
const HOLDER_SIDE_TILT = 0.06;
const HOLDER_SCALE = 0.68;

// paper-holder 모델의 정면 축에 iframe을 맞추고 홈 안쪽 깊이에 배치합니다.
const DOCUMENT_POSITION: [number, number, number] = [0.035, 0.9, -0.041];
const DOCUMENT_ROTATION: [number, number, number] = [-0.57, -0.62, -0.357];

export function CopyHolder({ onSelect }: { onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [frontFacing, setFrontFacing] = useState(true);
  const documentRef = useRef<Group>(null);
  const frontFacingRef = useRef(true);
  const worldPosition = useRef(new Vector3());
  const worldQuaternion = useRef(new Quaternion());
  const screenNormal = useRef(new Vector3());
  const cameraDirection = useRef(new Vector3());

  useFrame(({ camera }) => {
    const holderScreen = documentRef.current;
    if (!holderScreen) return;

    holderScreen.getWorldPosition(worldPosition.current);
    holderScreen.getWorldQuaternion(worldQuaternion.current);
    screenNormal.current.set(0, 0, 1).applyQuaternion(worldQuaternion.current);
    cameraDirection.current
      .copy(camera.position)
      .sub(worldPosition.current)
      .normalize();

    const nextFrontFacing =
      screenNormal.current.dot(cameraDirection.current) > 0;
    if (nextFrontFacing === frontFacingRef.current) return;

    frontFacingRef.current = nextFrontFacing;
    setFrontFacing(nextFrontFacing);
    if (!nextFrontFacing) {
      setHovered(false);
      document.body.style.cursor = "auto";
    }
  });

  const openResume = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group
      position={[-2.1, DESK_TOP_Y - 0.05, -0.51]}
      rotation={[0, HOLDER_CAMERA_YAW, 0]}
      scale={HOLDER_SCALE}
      onClick={openResume}
    >
      <group rotation={[HOLDER_FORWARD_TILT, 0, HOLDER_SIDE_TILT]}>
        <ModelAsset path={PAPER_HOLDER_MODEL} size={1.72} />

        <group
          ref={documentRef}
          position={DOCUMENT_POSITION}
          rotation={DOCUMENT_ROTATION}
        >
          <Html
            center
            transform
            distanceFactor={0.38}
            style={{
              pointerEvents: "none",
              display: frontFacing ? "block" : "none",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              className="relative h-[780px] w-[600px] overflow-hidden rounded-[8px] bg-white"
              style={{
                zoom: 2,
                WebkitFontSmoothing: "antialiased",
                backfaceVisibility: "hidden",
                pointerEvents: "auto",
              }}
            >
              <iframe
                src={RESUME_EMBED_URL}
                title="권태준 Notion 이력서 미리보기"
                className="absolute left-0 border-0 bg-white"
                style={{
                  colorScheme: "light",
                  top: "-24px",
                  width: "1152px",
                  height: "1590px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                  filter: "brightness(0.88) saturate(0.94)",
                }}
                loading="eager"
                tabIndex={-1}
                aria-hidden="true"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <button
                type="button"
                aria-label="이력서 자세히 보기"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect();
                }}
                onPointerEnter={() => {
                  setHovered(true);
                  document.body.style.cursor = "pointer";
                }}
                onPointerLeave={() => {
                  setHovered(false);
                  document.body.style.cursor = "auto";
                }}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className={`absolute inset-0 grid cursor-pointer place-items-center border-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-300 ${hovered ? "bg-slate-950/55" : "bg-transparent"}`}
              >
                <LuEye
                  size={160}
                  strokeWidth={1.4}
                  aria-hidden="true"
                  className={`text-white drop-shadow-[0_4px_12px_rgba(0,0,0,.55)] transition duration-200 ${hovered ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                />
              </button>
            </div>
          </Html>

          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[1.18, 1.58, 0.26]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(PAPER_HOLDER_MODEL);
