import { List, ListItem } from '@mui/material';
import DividerUpperNavbarOptions from '../DividerUpperNavbarOptions';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import SignInDialogButton from '@/components/navbars/navbarStorefront/upperNavbar/upperNavbarOptions/unauthenticatedUpperNavbarOptions/SignInDialogButton';
import SignUpDialogButton from '@/components/navbars/navbarStorefront/upperNavbar/upperNavbarOptions/unauthenticatedUpperNavbarOptions/SignUpDialogButton';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';

export default function UnauthenticatedUpperNavbarOptions() {
  return (
    <List
      sx={{ display: 'flex', height: 1 }}
      disablePadding>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' }, gap: '11px' }}>
        <ThemeToggleButton size="small" />
        <DividerUpperNavbarOptions />
      </ListItem>
      <ListItem disablePadding>
        <SignInDialogButton />
        <SignInDialog />
        <DividerUpperNavbarOptions />
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SignUpDialogButton />
        <SignUpDialog />
        <DividerUpperNavbarOptions />
      </ListItem>
    </List>
  );
}
