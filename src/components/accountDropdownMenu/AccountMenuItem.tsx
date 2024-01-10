'use client';

import { borderRadius } from '@/constants/styles';
import useColorPalette from '@/hooks/useColorPalette';
import { ListItemIcon, MenuItem } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  text: ReactNode;
  onClick?: () => void;
};

export default function AccountMenuItem({ icon, text, onClick }: Props) {
  const colorPalette = useColorPalette();

  return (
    <MenuItem
      sx={{
        borderRadius: borderRadius,
        color: 'white',
        '&:hover': { backgroundColor: colorPalette.primary.dark },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {text}
    </MenuItem>
  );
}
