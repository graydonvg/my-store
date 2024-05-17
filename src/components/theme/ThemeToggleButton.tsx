'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/features/theme/themeSlice';
import { IconButton, IconButtonProps, useTheme } from '@mui/material';
import { ThemeToggleIcon } from './ThemeToggleIcon';

type Props = {
  size: 'small' | 'medium' | 'large';
} & IconButtonProps;

export default function ThemeToggleButton({ size, ...props }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <IconButton
      aria-label={`Toggle theme. Current mode is ${mode}.`}
      onClick={changeTheme}
      size={size}
      {...props}>
      <ThemeToggleIcon
        size={size}
        color={theme.palette.custom.navbar.upper.text}
      />
    </IconButton>
  );
}
