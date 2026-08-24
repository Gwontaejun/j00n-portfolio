"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { DoubleSide, InstancedMesh, Object3D } from "three";

const RAIN_DROP_COUNT = 84;

function WindowRain() {
  const rainRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: RAIN_DROP_COUNT }, (_, index) => ({
        x: ((Math.sin(index * 91.73) + 1) / 2) * 4.8 - 2.4,
        y: ((Math.sin(index * 47.11 + 2) + 1) / 2) * 3.05 - 1.52,
        z: Math.sin(index * 13.37) * 0.03,
        speed: 0.55 + ((Math.sin(index * 23.9) + 1) / 2) * 0.7,
        length: 0.045 + ((Math.sin(index * 7.17) + 1) / 2) * 0.09,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (!rainRef.current) return;

    drops.forEach((drop, index) => {
      drop.y -= drop.speed * Math.min(delta, 0.05);
      if (drop.y < -1.62) drop.y = 1.62;
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.scale.set(1, drop.length, 1);
      dummy.updateMatrix();
      rainRef.current?.setMatrixAt(index, dummy.matrix);
    });
    rainRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={rainRef} args={[undefined, undefined, RAIN_DROP_COUNT]}>
      <boxGeometry args={[0.007, 0.25, 0.005]} />
      <meshBasicMaterial
        color="#d7ecfb"
        transparent
        opacity={0.34}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function WallSconce({ x }: { x: number }) {
  return (
    <group position={[x, 2.28, -3.62]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.34, 20]} />
        <meshStandardMaterial color="#5b4c40" roughness={0.58} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.28, 0.05]} castShadow>
        <sphereGeometry args={[0.18, 20, 16]} />
        <meshStandardMaterial color="#ffd39a" emissive="#ffad58" emissiveIntensity={1.7} roughness={0.42} />
      </mesh>
      <pointLight position={[0, -0.3, 0.42]} color="#ffbd78" intensity={2.7} distance={4.3} decay={2} />
    </group>
  );
}

export function RoomEnvironment() {
  return (
    <group>
      <mesh position={[0, 3.11, -3.82]} receiveShadow>
        <boxGeometry args={[17, 9.28, 0.16]} />
        <meshStandardMaterial color="#aaa197" roughness={0.97} />
      </mesh>
      <mesh position={[-8.42, 3.11, 2.3]} receiveShadow>
        <boxGeometry args={[0.14, 9.28, 12.4]} />
        <meshStandardMaterial color="#9b938b" roughness={0.97} />
      </mesh>
      <mesh position={[8.42, 3.11, 2.3]} receiveShadow>
        <boxGeometry args={[0.14, 9.28, 12.4]} />
        <meshStandardMaterial color="#9f978e" roughness={0.97} />
      </mesh>
      <mesh position={[0, 3.11, 8.45]} receiveShadow>
        <boxGeometry args={[17, 9.28, 0.14]} />
        <meshStandardMaterial color="#a59d94" roughness={0.97} />
      </mesh>
      <mesh position={[0, 7.75, 2.3]} receiveShadow>
        <boxGeometry args={[17, 0.12, 12.4]} />
        <meshStandardMaterial color="#b7afa6" roughness={0.98} />
      </mesh>

      <mesh position={[0, -1.53, 2.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[17, 12.4]} />
        <meshStandardMaterial color="#554035" roughness={0.86} />
      </mesh>
      {Array.from({ length: 15 }, (_, index) => (
        <mesh key={index} position={[-7.7 + index * 1.1, -1.515, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 12.4]} />
          <meshBasicMaterial color="#2f241f" transparent opacity={0.32} />
        </mesh>
      ))}

      <mesh position={[0, -1.1, -3.68]}>
        <boxGeometry args={[11.7, 0.14, 0.16]} />
        <meshStandardMaterial color="#d0c8be" roughness={0.88} />
      </mesh>

      <group position={[0, 2.3, -3.67]}>
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[5.15, 3.38]} />
          <meshBasicMaterial color="#142637" toneMapped={false} />
        </mesh>

        {[
          [-1.95, 0.78, "#b6d6ea"],
          [-1.45, -0.52, "#efb775"],
          [-0.72, 0.12, "#8ebbd8"],
          [0.82, -0.76, "#d79f6a"],
          [1.46, 0.42, "#acd1e6"],
          [2.05, -0.18, "#e3bd83"],
        ].map(([x, y, color], index) => (
          <mesh key={index} position={[x as number, y as number, -0.06]}>
            <circleGeometry args={[0.025 + (index % 2) * 0.012, 12]} />
            <meshBasicMaterial color={color as string} toneMapped={false} />
          </mesh>
        ))}

        <WindowRain />

        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[5.15, 3.38]} />
          <meshPhysicalMaterial
            color="#8bb0c7"
            transparent
            opacity={0.13}
            roughness={0.12}
            metalness={0.04}
            depthWrite={false}
          />
        </mesh>

        {[-2.62, 2.62].map((x) => (
          <RoundedBox key={x} args={[0.14, 3.62, 0.18]} radius={0.035} smoothness={3} position={[x, 0, 0.1]} castShadow>
            <meshStandardMaterial color="#493f38" roughness={0.68} />
          </RoundedBox>
        ))}
        {[-1.75, 1.75].map((y) => (
          <RoundedBox key={y} args={[5.38, 0.14, 0.18]} radius={0.035} smoothness={3} position={[0, y, 0.1]} castShadow>
            <meshStandardMaterial color="#493f38" roughness={0.68} />
          </RoundedBox>
        ))}
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.09, 3.42, 0.16]} />
          <meshStandardMaterial color="#493f38" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[5.2, 0.075, 0.16]} />
          <meshStandardMaterial color="#493f38" roughness={0.68} />
        </mesh>
        <RoundedBox args={[5.58, 0.18, 0.42]} radius={0.05} smoothness={3} position={[0, -1.86, 0.2]} castShadow>
          <meshStandardMaterial color="#654a39" roughness={0.74} />
        </RoundedBox>

        {[-3.03, 3.03].map((x) => (
          <group key={x} position={[x, 0, 0.16]}>
            <mesh rotation={[0, x < 0 ? -0.13 : 0.13, 0]} castShadow>
              <planeGeometry args={[0.82, 3.72, 12, 1]} />
              <meshStandardMaterial color="#88847e" roughness={1} side={DoubleSide} />
            </mesh>
            {[-0.24, 0, 0.24].map((offset) => (
              <mesh key={offset} position={[offset, 0, 0.035]}>
                <planeGeometry args={[0.025, 3.62]} />
                <meshBasicMaterial color="#686660" transparent opacity={0.23} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <WallSconce x={-3.82} />
      <WallSconce x={3.82} />

      <rectAreaLight position={[0, 2.45, -3.28]} rotation={[0, Math.PI, 0]} width={5} height={3.2} intensity={1.65} color="#7fb9df" />
      <rectAreaLight position={[0, 7.42, 0]} rotation={[Math.PI / 2, 0, 0]} width={5.8} height={3.4} intensity={1.15} color="#ffe0b7" />
    </group>
  );
}
