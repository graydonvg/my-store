'use client';

import { useScrollTrigger } from '@mui/material';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';

type Props = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
};

export function ElevationScroll({ children }: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
