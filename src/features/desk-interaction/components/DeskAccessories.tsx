"use client";

import { useGLTF } from "@react-three/drei";
import { Shape } from "three";
import { ModelAsset } from "./ModelAsset";
import { DESK_TOP_Y } from "../model/scene";

function createRoundedRectangle(width: number, height: number, radius: number) {
  const left = -width / 2;
  const right = width / 2;
  const bottom = -height / 2;
  const top = height / 2;
  const shape = new Shape();

  shape.moveTo(left + radius, bottom);
  shape.lineTo(right - radius, bottom);
  shape.quadraticCurveTo(right, bottom, right, bottom + radius);
  shape.lineTo(right, top - radius);
  shape.quadraticCurveTo(right, top, right - radius, top);
  shape.lineTo(left + radius, top);
  shape.quadraticCurveTo(left, top, left, top - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);

  return shape;
}

const DESK_MAT_OUTER_SHAPE = createRoundedRectangle(3.3, 1.34, 0.075);
const DESK_MAT_INNER_SHAPE = createRoundedRectangle(3.25, 1.29, 0.055);

function DeskMat() {
  return (
    <group position={[0, DESK_TOP_Y + 0.012, 0.42]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow={false} receiveShadow>
        <extrudeGeometry
          args={[
            DESK_MAT_OUTER_SHAPE,
            { depth: 0.014, bevelEnabled: false, curveSegments: 3 },
          ]}
        />
        <meshStandardMaterial color="#6f1116" roughness={0.88} />
      </mesh>
      <mesh
        position={[0, 0.016, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow={false}
        receiveShadow
      >
        <shapeGeometry args={[DESK_MAT_INNER_SHAPE, 3]} />
        <meshStandardMaterial color="#090a0c" roughness={0.94} />
      </mesh>
    </group>
  );
}

export function DeskMoodLamp() {
  return (
    <group position={[-2.48, DESK_TOP_Y + 0.02, -0.78]}>
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.09, 28]} />
        <meshStandardMaterial
          color="#24282d"
          roughness={0.38}
          metalness={0.62}
        />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 0.5, 28]} />
        <meshPhysicalMaterial
          color="#ffd0a0"
          emissive="#ff8a3d"
          emissiveIntensity={1.2}
          transparent
          opacity={0.72}
          roughness={0.24}
          transmission={0.18}
          thickness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.585, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.035, 28]} />
        <meshStandardMaterial
          color="#2b2f35"
          roughness={0.4}
          metalness={0.55}
        />
      </mesh>
      <pointLight
        position={[0, 0.38, 0.06]}
        color="#ff9b4a"
        intensity={1.25}
        distance={5.8}
        decay={2}
      />
    </group>
  );
}

export function DeskAccessories() {
  return (
    <group>
      <DeskMat />
      <group
        position={[-0.2, DESK_TOP_Y + 0.015, 0.8]}
        rotation={[0, 0.035, 0]}
      >
        <ModelAsset
          path="/3d-models/low-poly-keyboard.glb"
          size={1.56}
          castShadow={false}
        />
      </group>
      <group position={[1.1, DESK_TOP_Y + 0.04, 0.43]} rotation={[0, 1.2, 0]}>
        <ModelAsset path="/3d-models/mouse.glb" size={0.5} />
      </group>
    </group>
  );
}

useGLTF.preload("/3d-models/low-poly-keyboard.glb");
useGLTF.preload("/3d-models/mouse.glb");
