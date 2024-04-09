import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';

type Props = {
  children: ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
