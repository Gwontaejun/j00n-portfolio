"use client";

import { Html, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuEye } from "react-icons/lu";
import {
  FrontSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  type Group,
} from "three";
import { GuestbookNotes } from "@/features/guestbook/components/GuestbookNotes";
import { useGuideHighlight } from "../hooks/useGuideHighlight";
import { ModelAsset } from "./ModelAsset";

type ProfileBoardProps = {
  onSelect: () => void;
  onFocusGuestbook: () => void;
  onOpenGuestbook: () => void;
  onCloseGuestbookComposer: () => void;
  guestbookComposerOpen?: boolean;
  interactionDisabled?: boolean;
  profileGuideDimmed?: boolean;
  profileGuideHighlighted?: boolean;
  guestbookGuideDimmed?: boolean;
};

export function ProfileBoard({
  onSelect,
  onFocusGuestbook,
  onOpenGuestbook,
  onCloseGuestbookComposer,
  guestbookComposerOpen = false,
  interactionDisabled = false,
  profileGuideDimmed = false,
  profileGuideHighlighted = false,
  guestbookGuideDimmed = false,
}: ProfileBoardProps) {
  const [hovered, setHovered] = useState(false);
  const profileRef = useRef<Group>(null);
  const loadedProfileTexture = useTexture("/pdf/profile-page-1.png");
  const gl = useThree((state) => state.gl);
  const profileTexture = useMemo(() => {
    const texture = loadedProfileTexture.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [gl, loadedProfileTexture]);

  useGuideHighlight(profileRef, profileGuideHighlighted);

  useEffect(() => {
    return () => profileTexture.dispose();
  }, [profileTexture]);

  return (
    <group position={[-6.2, 1.2, -1.45]}>
      <ModelAsset path="/3d-models/cork-board.glb" size={2.6} />

      <Html
        center
        transform
        position={[0.025, 0.85, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
        distanceFactor={0.5}
        style={{
          pointerEvents: interactionDisabled ? "none" : "auto",
          contain: "layout paint style",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          ...(guestbookGuideDimmed
            ? {
                filter: "brightness(0.32)",
                transition: "filter 220ms ease",
              }
            : {}),
        }}
      >
        <GuestbookNotes
          interactionDisabled={interactionDisabled}
          composerOpen={guestbookComposerOpen}
          onFocusGuestbook={onFocusGuestbook}
          onOpenGuestbook={onOpenGuestbook}
          onCloseComposer={onCloseGuestbookComposer}
        />
      </Html>

      <group ref={profileRef}>
        <mesh
          position={[0.028, 1, -0.72]}
          rotation={[0, Math.PI / 2, 0]}
          renderOrder={1}
        >
          <planeGeometry args={[0.7, 0.99]} />
          <meshBasicMaterial
            map={profileTexture}
            color="#d8d1c5"
            side={FrontSide}
            toneMapped
          />
        </mesh>
      </group>

      <Html
        center
        transform
        position={[0.025, 1, -0.72]}
        rotation={[0, Math.PI / 2, 0]}
        distanceFactor={0.7}
        style={{
          pointerEvents: interactionDisabled ? "none" : "auto",
          contain: "layout paint style",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter: profileGuideDimmed ? "brightness(0.32)" : "none",
          transition: "filter 220ms ease",
        }}
      >
        <button
          type="button"
          aria-label="프로필 상세 보기"
          disabled={interactionDisabled}
          onClick={(event) => {
            event.stopPropagation();
            if (!interactionDisabled) onSelect();
          }}
          onPointerEnter={() => {
            if (interactionDisabled) return;
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onFocus={() => {
            if (!interactionDisabled) setHovered(true);
          }}
          onBlur={() => setHovered(false)}
          className="group relative block h-[566px] w-[400px] overflow-hidden bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.015] focus-visible:ring-8 focus-visible:ring-sky-300"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-0 grid place-items-center bg-slate-950/45 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
          >
            <LuEye
              size={82}
              strokeWidth={1.4}
              className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,.5)]"
            />
          </span>
        </button>
      </Html>
    </group>
  );
}
