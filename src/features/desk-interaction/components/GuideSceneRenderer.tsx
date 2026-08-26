'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import {
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
} from 'three';

const DEFAULT_LAYER = 0;
const GUIDE_LAYER = 1;

export function GuideSceneRenderer({ active }: { active: boolean }) {
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const overlay = useMemo(() => {
    const overlayScene = new Scene();
    const overlayCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new MeshBasicMaterial({
      color: '#03060b',
      transparent: true,
      opacity: 0.68,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    mesh.frustumCulled = false;
    overlayScene.add(mesh);

    return { overlayScene, overlayCamera, material, geometry: mesh.geometry };
  }, []);

  useEffect(() => {
    scene.traverse((object) => {
      if ('isLight' in object && object.isLight) object.layers.enable(GUIDE_LAYER);
    });
    invalidate();
  }, [active, invalidate, scene]);

  useEffect(
    () => () => {
      overlay.geometry.dispose();
      overlay.material.dispose();
    },
    [overlay],
  );

  useFrame(({ gl, camera }) => {
    const previousAutoClear = gl.autoClear;

    camera.layers.set(DEFAULT_LAYER);
    gl.autoClear = true;
    gl.render(scene, camera);

    if (active) {
      gl.autoClear = false;
      gl.render(overlay.overlayScene, overlay.overlayCamera);
      gl.clearDepth();
      camera.layers.set(GUIDE_LAYER);
      gl.render(scene, camera);
    }

    camera.layers.set(DEFAULT_LAYER);
    gl.autoClear = previousAutoClear;
  }, 1);

  return null;
}
