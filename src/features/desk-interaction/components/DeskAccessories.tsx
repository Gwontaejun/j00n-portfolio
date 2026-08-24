"use client";

import { useGLTF } from "@react-three/drei";
import { ModelAsset } from "./ModelAsset";
import { DESK_TOP_Y } from "../model/scene";

export function DeskAccessories() {
  return (
    <group>
      <group position={[0, DESK_TOP_Y + 0.005, 0.42]} rotation={[0, 0, 0]}>
        <ModelAsset path="/3d-models/long-pad.glb" size={3.3} />
      </group>
      <group position={[-0.4, DESK_TOP_Y + 0.035, 0.42]} rotation={[0, 0.1, 0]}>
        <ModelAsset path="/3d-models/keyboard.glb" size={1.8} />
      </group>
      <group position={[1.1, DESK_TOP_Y + 0.04, 0.43]} rotation={[0, 1.2, 0]}>
        <ModelAsset path="/3d-models/mouse.glb" size={0.6} />
      </group>
    </group>
  );
}

useGLTF.preload("/3d-models/keyboard.glb");
useGLTF.preload("/3d-models/mouse.glb");
useGLTF.preload("/3d-models/long-pad.glb");
