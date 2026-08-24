'use client';

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Box3, Color, Mesh, Texture, Vector3 } from 'three';

type ModelAssetProps = {
  path: string;
  size: number;
  dimMaterial?: string;
  dimmed?: boolean;
  dimStrength?: number;
};

/** 원본 GLB의 단위와 중심점이 달라도 동일한 씬 단위로 맞춥니다. */
export function ModelAsset({ path, size, dimMaterial, dimmed = false, dimStrength = 0.4 }: ModelAssetProps) {
  const { scene } = useGLTF(path);
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());

  const normalized = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material) ? child.material : [child.material];
        const nextMaterials = materials.map((material) => {
          const nextMaterial = material.clone();

          if ('color' in nextMaterial && nextMaterial.color instanceof Color) {
            nextMaterial.userData.baseColor = `#${nextMaterial.color.getHexString()}`;
          }
          if ('emissive' in nextMaterial && nextMaterial.emissive instanceof Color) {
            nextMaterial.userData.baseEmissive = `#${nextMaterial.emissive.getHexString()}`;
          }

          Object.values(nextMaterial).forEach((value) => {
            if (value instanceof Texture) {
              value.anisotropy = maxAnisotropy;
              value.needsUpdate = true;
            }
          });
          return nextMaterial;
        });

        child.material = Array.isArray(child.material) ? nextMaterials : nextMaterials[0];
      }
    });

    const bounds = new Box3().setFromObject(model);
    const dimensions = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const longestSide = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1;

    return {
      model,
      scale: size / longestSide,
      offset: new Vector3(-center.x, -bounds.min.y, -center.z),
    };
  }, [maxAnisotropy, scene, size]);

  useEffect(() => {
    if (!dimMaterial) return;

    normalized.model.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material.name !== dimMaterial) return;
        if ('color' in material && material.color instanceof Color) {
          const baseColor = new Color(material.userData.baseColor);
          material.color.copy(dimmed ? baseColor.lerp(new Color('#05070a'), dimStrength) : baseColor);
        }
        if ('emissive' in material && material.emissive instanceof Color) {
          const baseEmissive = new Color(material.userData.baseEmissive);
          material.emissive.copy(dimmed ? baseEmissive.multiplyScalar(1 - dimStrength) : baseEmissive);
        }
        material.needsUpdate = true;
      });
    });
  }, [dimMaterial, dimmed, dimStrength, normalized.model]);

  return (
    <group scale={normalized.scale}>
      <primitive object={normalized.model} position={normalized.offset} />
    </group>
  );
}
