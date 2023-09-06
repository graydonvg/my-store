'use client';

import { useContext } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { ThemeToggleContext } from './ThemeToggleContext';

export function ThemeToggle() {
  const theme = useTheme();
  const themeToggle = useContext(ThemeToggleContext);
  const mode = theme.palette.mode;

  return (
    <MenuItem onClick={themeToggle.toggleColorMode}>
      <ListItemIcon color="inherit">
        {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
      </ListItemIcon>
      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
    </MenuItem>
  );
}
