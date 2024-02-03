'use client';

import { ListItemButton, ListItemText } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawerOptionIcon from './NavDrawerOptionIcon';

type ButtonNoLinkProps = {
  path: string;
  label: string;
};

export default function NavDrawerOptionButtonNoLink({ label }: ButtonNoLinkProps) {
  const colorPalette = useColorPalette();

  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: colorPalette.navBar.lower.text }}
      />
      <NavDrawerOptionIcon label={label} />
    </ListItemButton>
  );
}
