"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { ShaderMaterial, SRGBColorSpace } from "three";

const WINDOW_X = -1.5;
const ROOM_WIDTH = 12.7;
const ROOM_DEPTH = 8.6;
const ROOM_CENTER_Z = 0.48;
const WINDOW_WIDTH = 2.85;
const WINDOW_HEIGHT = 1.9;

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
    float phase = columnRandom * 11.7;
    float cycle = floor((uTime * speed + phase) * 0.42);
    float cycleRandom = hash21(vec2(column + cycle * 19.17, seed + cycle * 0.73));
    float cycleRandom2 = hash21(vec2(column - cycle * 7.31, seed + cycle * 3.19));
    float fallSpeed = speed * mix(0.52, 1.48, cycleRandom);

    p.y += uTime * fallSpeed + phase + cycleRandom2 * 3.4;
    p.x += (cycleRandom - 0.5) * 0.86;
    p.x += sin(uTime * mix(0.08, 0.2, cycleRandom2) + columnRandom * 12.0) * 0.015;

    vec2 cell = floor(p);
    vec2 local = fract(p) - 0.5;
    float random = hash21(cell + vec2(seed + cycle * 2.17, cycleRandom * 13.1));
    float random2 = hash21(cell + vec2(seed + 17.4, cycle * 5.73));
    float timeOffset = hash21(cell + vec2(seed + 31.8, cycle * 1.91));
    local.y += (timeOffset - 0.5) * 0.34;
    local.x += (random - 0.5) * 0.9;
    local.x += sin(local.y * 8.0 + random * 6.283) * 0.003;

    float width = mix(0.003, 0.009, random);
    float line = 1.0 - smoothstep(width, width + 0.009, abs(local.x));
    float head = mix(0.02, 0.42, random2);
    float dropLength = mix(0.08, 0.52, hash21(vec2(random * 21.3, cycleRandom2 * 17.8)));
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

  useFrame(({ clock, invalidate }) => {
    if (materialRef.current)
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    invalidate();
  });

  return (
    <mesh position={[0, 0, -0.015]}>
      <planeGeometry args={[WINDOW_WIDTH - 0.08, WINDOW_HEIGHT - 0.08]} />
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
        <boxGeometry args={[ROOM_WIDTH, 9.28, 0.16]} />
        <meshStandardMaterial color="#aaa197" roughness={0.97} />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2, 3.11, ROOM_CENTER_Z]} receiveShadow>
        <boxGeometry args={[0.14, 9.28, ROOM_DEPTH]} />
        <meshStandardMaterial color="#9b938b" roughness={0.97} />
      </mesh>
      <mesh position={[ROOM_WIDTH / 2, 3.11, ROOM_CENTER_Z]} receiveShadow>
        <boxGeometry args={[0.14, 9.28, ROOM_DEPTH]} />
        <meshStandardMaterial color="#9f978e" roughness={0.97} />
      </mesh>
      <mesh position={[0, 3.11, ROOM_CENTER_Z + ROOM_DEPTH / 2]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, 9.28, 0.14]} />
        <meshStandardMaterial color="#a59d94" roughness={0.97} />
      </mesh>
      <mesh position={[0, 7.75, ROOM_CENTER_Z]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, 0.12, ROOM_DEPTH]} />
        <meshStandardMaterial color="#b7afa6" roughness={0.98} />
      </mesh>

      <mesh
        position={[0, -1.53, ROOM_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#554035" roughness={0.86} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh
          key={index}
          position={[-5.5 + index * 1.1, -1.515, ROOM_CENTER_Z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.012, ROOM_DEPTH]} />
          <meshBasicMaterial color="#2f241f" transparent opacity={0.32} />
        </mesh>
      ))}

      <group position={[WINDOW_X, 2.55, -3.67]}>
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[WINDOW_WIDTH, WINDOW_HEIGHT]} />
          <meshBasicMaterial
            map={rainyNightTexture}
            color="#929daa"
            toneMapped={false}
          />
        </mesh>

        <WindowRain />

        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[WINDOW_WIDTH, WINDOW_HEIGHT]} />
          <meshPhysicalMaterial
            color="#8bb0c7"
            transparent
            opacity={0.13}
            roughness={0.12}
            metalness={0.04}
            depthWrite={false}
          />
        </mesh>

        {[-1.5, 1.5].map((x) => (
          <RoundedBox
            key={x}
            args={[0.12, 2.12, 0.18]}
            radius={0.035}
            smoothness={3}
            position={[x, 0, 0.1]}
            castShadow
          >
            <meshStandardMaterial color="#493f38" roughness={0.68} />
          </RoundedBox>
        ))}
        {[-1.04, 1.04].map((y) => (
          <RoundedBox
            key={y}
            args={[3.12, 0.12, 0.18]}
            radius={0.035}
            smoothness={3}
            position={[0, y, 0.1]}
            castShadow
          >
            <meshStandardMaterial color="#493f38" roughness={0.68} />
          </RoundedBox>
        ))}
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.075, 1.92, 0.16]} />
          <meshStandardMaterial color="#493f38" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[2.9, 0.065, 0.16]} />
          <meshStandardMaterial color="#493f38" roughness={0.68} />
        </mesh>
        <RoundedBox
          args={[3.35, 0.16, 0.38]}
          radius={0.05}
          smoothness={3}
          position={[0, -1.16, 0.2]}
          castShadow
        >
          <meshStandardMaterial color="#654a39" roughness={0.74} />
        </RoundedBox>
      </group>

      <rectAreaLight
        position={[WINDOW_X, 2.55, -3.3]}
        rotation={[0, Math.PI, 0]}
        width={2.7}
        height={1.8}
        intensity={0.38}
        color="#88a9c5"
      />
    </group>
  );
}
