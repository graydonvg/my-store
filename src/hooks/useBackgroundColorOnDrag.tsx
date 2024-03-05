import { animate, MotionValue, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import useColorPalette from './useColorPalette';

const inactiveBackgroundColor = 'rgba(0,0,0,0)';

export function useBackgroundColorOnDrag(value: MotionValue<number>) {
  const colorPalette = useColorPalette();
  const backgroundColorOnDrag = useMotionValue(inactiveBackgroundColor);

  useEffect(() => {
    let isActive = false;

    const unsubscribe = value.on('change', (value) => {
      const wasActive = isActive;

      if (value !== 0) {
        isActive = true;

        if (isActive !== wasActive) {
          animate(backgroundColorOnDrag, colorPalette.boxShadow);
        }
      } else {
        isActive = false;

        if (isActive !== wasActive) {
          animate(backgroundColorOnDrag, inactiveBackgroundColor);
        }
      }
    });

    return () => unsubscribe();
  }, [value, backgroundColorOnDrag, colorPalette.boxShadow]);

  return backgroundColorOnDrag;
}
