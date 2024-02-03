'use client';

import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { ListItemIcon, MenuItem } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
};

export default function AccountDropdownMenuItem({ icon, label, onClick }: Props) {
  const colorPalette = useColorPalette();

  return (
    <MenuItem
      sx={{
        borderRadius: BORDER_RADIUS,
        color: 'white',
        '&:hover': { backgroundColor: colorPalette.primary.dark },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {label}
    </MenuItem>
  );
}
