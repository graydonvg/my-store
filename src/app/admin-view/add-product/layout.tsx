'use client';

import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';

export default function AddProductLayout({ children }: { children: ReactNode }) {
  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
