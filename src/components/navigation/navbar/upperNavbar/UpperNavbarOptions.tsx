'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, List, ListItem } from '@mui/material';
import CartDrawer from '../../../CartDrawer';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import SignInForm from '@/components/forms/SignInForm';
import SignUpForm from '@/components/forms/SignUpForm';
import NavDrawer from '../../navDrawer/NavDrawer';

function renderDivider() {
  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'custom.grey.dark' : 'black'),
      }}
      flexItem
    />
  );
}

export default function UpperNavbarOptions() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const customColorPalette = useCustomColorPalette();

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}>
        <NavDrawer />
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={customColorPalette.grey.light}
      />
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {currentUser ? (
          <>
            <List
              sx={{ display: 'flex', height: '100%' }}
              disablePadding>
              {renderDivider()}
              <ListItem disablePadding>
                <CartDrawer />
              </ListItem>
              {renderDivider()}
              <ListItem disablePadding>
                <AccountMenu />
              </ListItem>
              {renderDivider()}
            </List>
          </>
        ) : (
          <List
            sx={{ display: 'flex', height: '100%' }}
            disablePadding>
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex', marginRight: 16 } }}>
              <ThemeToggleIcon
                size="small"
                color={customColorPalette.grey.light}
              />
            </ListItem>
            {renderDivider()}
            <ListItem disablePadding>
              <SignInForm />
            </ListItem>
            {renderDivider()}
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SignUpForm />
            </ListItem>
            {renderDivider()}
          </List>
        )}
      </Box>
    </>
  );
}
