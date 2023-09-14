'use client';

import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

type ThemeIconProps = {
  size: 'small' | 'medium' | 'large';
  color: string;
};

export function ThemeIcon({ size, color }: ThemeIconProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <>
      {mode === 'dark' ? (
        <Brightness4Icon
          fontSize={size}
          sx={{ color }}
        />
      ) : (
        <Brightness7Icon
          fontSize={size}
          sx={{ color }}
        />
      )}
    </>
  );
}
