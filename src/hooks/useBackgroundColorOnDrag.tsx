import { animate, MotionValue, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import useColorPalette from './useColorPalette';

const inactiveBackgroundColor = 'rgba(0,0,0,0)';

export function useBackgroundColorOnDrag(value: MotionValue<number>) {
  const backgroundColor = useMotionValue(inactiveBackgroundColor);
  const colorPalette = useColorPalette();

  useEffect(() => {
    let isActive = false;
    const unsubscribe = value.on('change', (latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(backgroundColor, colorPalette.boxShadow);
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(backgroundColor, inactiveBackgroundColor);
        }
      }
    });

    return () => unsubscribe();
  }, [value, backgroundColor, colorPalette.boxShadow]);

  return backgroundColor;
}
