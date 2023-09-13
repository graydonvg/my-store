'use client';

import ListItemIcon from '@mui/material/ListItemIcon';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <MenuItem
      onClick={changeTheme}
      sx={{
        color: 'dropdownMenu.text',
        '&:hover': { backgroundColor: 'dropdownMenu.hover' },
      }}>
      <ListItemIcon>
        {mode === 'dark' ? (
          <Brightness4Icon
            fontSize="small"
            sx={{ color: 'upperNavbar.primaryIcon' }}
          />
        ) : (
          <Brightness7Icon
            fontSize="small"
            sx={{ color: 'upperNavbar.primaryIcon' }}
          />
        )}
      </ListItemIcon>
      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
    </MenuItem>
  );
}
