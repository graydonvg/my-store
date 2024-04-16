import { Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';

export default function ThemeButtonNavDrawerOptions() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <ListItem
        disablePadding
        sx={{ height: '56px' }}>
        <ListItemButton
          onClick={changeTheme}
          sx={{ width: 1, height: '100%' }}>
          <ListItemText
            primary={`${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} Mode`}
            sx={{ color: theme.palette.custom.navBar.lower.text }}
          />
          <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center' }}>
            <ThemeToggleIcon
              color={theme.palette.custom.navBar.lower.text}
              size={'small'}
            />
          </Box>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
}
