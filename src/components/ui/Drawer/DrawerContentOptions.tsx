import NavDrawerContent from '@/components/Navigation/NavDrawer/NavDrawerContent';
import { useAppSelector } from '@/lib/redux/hooks';

export default function DrawerContentOptions() {
  const drawerContent = useAppSelector((state) => state.drawer.drawerContent);

  return <>{drawerContent === 'nav' ? <NavDrawerContent /> : null}</>;
}
