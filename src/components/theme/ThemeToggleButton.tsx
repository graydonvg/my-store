import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { IconButton, useTheme } from '@mui/material';
import { ThemeToggleIcon } from './ThemeToggleIcon';

export default function ThemeToggleButton() {
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
      size="small">
      <ThemeToggleIcon
        size="small"
        color={theme.palette.custom.navBar.upper.text}
      />
    </IconButton>
  );
}
