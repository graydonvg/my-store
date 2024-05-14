import LayoutAdminPanelClient from '@/components/adminPanel/LayoutAdminPanelClient';
import { ReactNode } from 'react';

export default function LayoutAdminPanel({ children }: { children: ReactNode }) {
  return <LayoutAdminPanelClient>{children}</LayoutAdminPanelClient>;
}
