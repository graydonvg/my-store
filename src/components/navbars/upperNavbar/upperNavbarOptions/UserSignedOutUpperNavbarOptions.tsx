import { useAppDispatch } from '@/lib/redux/hooks';
import { IconButton, List, ListItem, useTheme } from '@mui/material';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import useColorPalette from '@/hooks/useColorPalette';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';

export default function UserSignedOutUpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <List
      sx={{ display: 'flex', height: '100%' }}
      disablePadding>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' }, gap: '11px' }}>
        <IconButton
          aria-label={`Toggle theme. Current mode is ${mode}.`}
          onClick={handleToggleTheme}
          size="small">
          <ThemeToggleIcon
            size="small"
            color={colorPalette.navBar.upper.text}
          />
        </IconButton>
        <DividerUpperNavbarOptions />
      </ListItem>
      <ListItem disablePadding>
        <SignInDialog />
        <DividerUpperNavbarOptions />
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SignUpDialog />
        <DividerUpperNavbarOptions />
      </ListItem>
    </List>
  );
}
