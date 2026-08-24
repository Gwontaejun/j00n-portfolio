"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { DoubleSide, ShaderMaterial, SRGBColorSpace } from "three";

const rainVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rainFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float rainLayer(vec2 uv, float columns, float speed, float seed) {
    vec2 p = uv;
    p.x += p.y * 0.055;
    p *= vec2(columns, columns * 0.34);

    float column = floor(p.x);
    float columnRandom = hash21(vec2(column, seed));
    float fallSpeed = speed * mix(0.48, 1.55, columnRandom);
    p.y += uTime * fallSpeed + columnRandom * 9.7;
    p.x += sin(uTime * 0.1 + columnRandom * 12.0) * 0.008;

    vec2 cell = floor(p);
    vec2 local = fract(p) - 0.5;
    float random = hash21(cell + seed);
    float random2 = hash21(cell + seed + 17.4);
    float timeOffset = hash21(cell + seed + 31.8);
    local.y += (timeOffset - 0.5) * 0.34;
    local.x += (random - 0.5) * 0.9;
    local.x += sin(local.y * 8.0 + random * 6.283) * 0.003;

    float width = mix(0.003, 0.009, random);
    float line = 1.0 - smoothstep(width, width + 0.009, abs(local.x));
    float head = mix(0.02, 0.42, random2);
    float dropLength = mix(0.1, 0.5, random);
    float tail = head - dropLength;
    float segment = smoothstep(tail - 0.05, tail + 0.035, local.y)
      * (1.0 - smoothstep(head, head + 0.07, local.y));
    float headGlow = 1.0 - smoothstep(width * 1.3, width * 3.8, length(vec2(local.x, (local.y - head) * 0.52)));
    float presence = step(0.34, random);

    return (line * segment + headGlow * 0.2) * presence;
  }

  void main() {
    float farRain = rainLayer(vUv, 27.0, 4.56, 1.3);
    float nearRain = rainLayer(vUv + vec2(0.13, 0.0), 17.0, 6.96, 4.9);

    float softPulse = 0.94 + sin(uTime * 0.42) * 0.06;
    float alpha = (farRain * 0.055 + nearRain * 0.095) * softPulse;
    vec3 color = mix(vec3(0.52, 0.67, 0.76), vec3(0.82, 0.91, 0.95), nearRain);

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.18));
  }
`;

function WindowRain() {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -0.015]}>
      <planeGeometry args={[5.08, 3.32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={rainVertexShader}
        fragmentShader={rainFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
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
        <meshStandardMaterial color="#dce1df" emissive="#aab6ba" emissiveIntensity={0.7} roughness={0.42} />
      </mesh>
      <pointLight position={[0, -0.3, 0.42]} color="#aebfc6" intensity={0.65} distance={4.3} decay={2} />
    </group>
  );
}

export function RoomEnvironment() {
  const sourceTexture = useTexture("/textures/rainy-night-window.webp");
  const rainyNightTexture = useMemo(() => {
    const texture = sourceTexture.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [sourceTexture]);

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
          <meshBasicMaterial map={rainyNightTexture} color="#929daa" toneMapped={false} />
        </mesh>

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

      <rectAreaLight position={[0, 2.45, -3.28]} rotation={[0, Math.PI, 0]} width={5} height={3.2} intensity={0.55} color="#7799b5" />
      <rectAreaLight position={[0, 7.42, 0]} rotation={[Math.PI / 2, 0, 0]} width={5.8} height={3.4} intensity={0.3} color="#cbd6df" />
    </group>
  );
}
