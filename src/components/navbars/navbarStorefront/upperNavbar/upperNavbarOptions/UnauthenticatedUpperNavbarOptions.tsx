'use client';

import { List, ListItem } from '@mui/material';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';

export default function UnauthenticatedUpperNavbarOptions() {
  return (
    <List
      sx={{ display: 'flex', height: '100%' }}
      disablePadding>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' }, gap: '11px' }}>
        <ThemeToggleButton size="small" />
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
