import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
