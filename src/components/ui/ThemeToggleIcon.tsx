'use client';

import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

type ThemeToggleIconProps = {
  size: 'small' | 'medium' | 'large';
  color: string;
};

export function ThemeToggleIcon({ size, color }: ThemeToggleIconProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <IconButton
      onClick={handleToggleTheme}
      size="small"
      sx={{
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}>
      {mode === 'dark' ? (
        <Brightness7Icon
          fontSize={size}
          sx={{ color }}
        />
      ) : (
        <Brightness4Icon
          fontSize={size}
          sx={{ color }}
        />
      )}
    </IconButton>
  );
}
