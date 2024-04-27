import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { IconButton, useTheme } from '@mui/material';
import { ThemeToggleIcon } from './ThemeToggleIcon';

type Props = {
  size: 'small' | 'medium' | 'large';
};

export default function ThemeToggleButton({ size }: Props) {
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
      size={size}>
      <ThemeToggleIcon
        size={size}
        color={theme.palette.custom.navBar.upper.text}
      />
    </IconButton>
  );
}
