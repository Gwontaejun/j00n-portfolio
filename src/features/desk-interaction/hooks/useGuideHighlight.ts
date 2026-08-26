'use client';

import { useThree } from '@react-three/fiber';
import { type RefObject, useLayoutEffect } from 'react';
import { Group } from 'three';

const DEFAULT_LAYER = 0;
const GUIDE_LAYER = 1;

export function useGuideHighlight(ref: RefObject<Group | null>, highlighted: boolean) {
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;

    group.traverse((object) => object.layers.set(highlighted ? GUIDE_LAYER : DEFAULT_LAYER));
    invalidate();

    return () => {
      group.traverse((object) => object.layers.set(DEFAULT_LAYER));
      invalidate();
    };
  }, [highlighted, invalidate, ref]);
}
