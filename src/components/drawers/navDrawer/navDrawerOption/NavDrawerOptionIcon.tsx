'use client';

import { ArrowForwardIos, Logout } from '@mui/icons-material';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  label: string;
};

export default function NavDrawerOptionIcon({ label }: Props) {
  const colorPalette = useColorPalette();

  if (label === 'Sign Out') {
    return <Logout sx={{ color: colorPalette.navBar.lower.text }} />;
  } else {
    return <ArrowForwardIos sx={{ color: colorPalette.navBar.lower.text }} />;
  }
}
