import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
