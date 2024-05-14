import { ReactNode } from 'react';
import LayoutCheckoutFlowClient from '@/components/checkoutFlow/LayoutCheckoutFlowClient';

type Props = {
  children: ReactNode;
};

export default async function LayoutCheckoutFlow({ children }: Props) {
  return <LayoutCheckoutFlowClient>{children}</LayoutCheckoutFlowClient>;
}
