import { useTheme, ListItemButton, ListItemText, Divider, ListItem, IconButton } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/features/theme/themeSlice';

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
            sx={{ color: theme.palette.custom.navbar.lower.text }}
          />
          <IconButton
            sx={{
              color: theme.palette.custom.navbar.upper.text,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <ThemeToggleIcon
              color={theme.palette.custom.navbar.lower.text}
              size={'small'}
            />
          </IconButton>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
}
