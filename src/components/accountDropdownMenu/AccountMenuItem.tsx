'use client';

import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ListItemIcon, MenuItem } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  text: ReactNode;
  onClick?: () => void;
};

export default function AccountMenuItem({ icon, text, onClick }: Props) {
  const customColorPalette = useCustomColorPalette();

  return (
    <MenuItem
      sx={{
        borderRadius: borderRadius,
        color: 'white',
        '&:hover': { backgroundColor: customColorPalette.primary.dark },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {text}
    </MenuItem>
  );
}
