'use client';

import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import { ReactNode } from 'react';

export default function ManageProductsLayout({ children }: { children: ReactNode }) {
  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
