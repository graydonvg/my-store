'use client';

import { Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import useColorPalette from '@/hooks/useColorPalette';

export default function ThemeButtonNavDrawerOptions() {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <ListItem
        disablePadding
        sx={{ height: '56px' }}>
        <ListItemButton
          onClick={handleToggleTheme}
          sx={{ width: 1, height: '100%' }}>
          <ListItemText
            primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
            sx={{ color: colorPalette.navBar.lower.text }}
          />
          <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center' }}>
            <ThemeToggleIcon
              color={colorPalette.navBar.lower.text}
              size={'small'}
            />
          </Box>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
}
