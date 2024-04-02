import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { IconButton, useTheme } from '@mui/material';
import { ThemeToggleIcon } from './ThemeToggleIcon';

export default function ThemeToggleButton() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colorPalette = useColorPalette();

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <IconButton
      // disableRipple
      aria-label={`Toggle theme. Current mode is ${mode}.`}
      onClick={changeTheme}
      size="small">
      <ThemeToggleIcon
        size="small"
        color={colorPalette.navBar.upper.text}
      />
    </IconButton>
  );
}
