'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import Cart from '../../../ui/Cart';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Menu } from '@mui/icons-material';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import DrawerComponent from '@/components/ui/DrawerComponent';
import NavDrawerContent from '../../navDrawer/NavDrawerContent';
import ModalComponent from '@/components/ui/ModalComponent';
import SignInForm from '@/components/forms/SignInForm';
import SignUpForm from '@/components/forms/SignUpForm';
import { setIsSignInModalOpen, setIsSignUpModalOpen } from '@/lib/redux/modal/modalSlice';

function renderButton(label: string, color: CustomColorPaletteReturnType, onClick: () => void) {
  return (
    <Typography
      component="button"
      variant="button"
      sx={{
        height: 1,
        paddingX: { xs: 0, md: 2 },
        color: color.grey.light,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
      onClick={onClick}>
      {label}
    </Typography>
  );
}

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
  const { isSignInModalOpen, isSignUpModalOpen } = useAppSelector((state) => state.modal);
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleOpenNavDrawer() {
    dispatch(setIsNavDrawerOpen({ left: true }));
  }

  function handleOpenSignInModal() {
    dispatch(setIsSignInModalOpen(true));
  }

  function handleOpenSignUpModal() {
    dispatch(setIsSignUpModalOpen(true));
  }

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          // minWidth: { xs: '52px', sm: '124px' },
        }}>
        <Menu
          sx={{
            color: color.grey.light,
            cursor: 'pointer',
          }}
          aria-label="open navigation drawer"
          onClick={handleOpenNavDrawer}
        />
        <DrawerComponent
          isOpen={isNavDrawerOpen}
          zIndex={(theme) => theme.zIndex.appBar + 1}>
          <NavDrawerContent />
        </DrawerComponent>
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={color.grey.light}
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
                <Cart />
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
              <IconButton
                disableRipple
                onClick={handleToggleTheme}
                size="small">
                <ThemeToggleIcon
                  size="small"
                  color={color.grey.light}
                />
              </IconButton>
            </ListItem>
            {renderDivider()}
            <ListItem disablePadding>{renderButton('Sign in', color, () => handleOpenSignInModal())}</ListItem>
            <ModalComponent isOpen={isSignInModalOpen}>
              <SignInForm />
            </ModalComponent>
            {renderDivider()}
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
              {renderButton('Sign Up', color, () => handleOpenSignUpModal())}
            </ListItem>
            <ModalComponent isOpen={isSignUpModalOpen}>
              <SignUpForm />
            </ModalComponent>
            {renderDivider()}
          </List>
        )}
      </Box>
    </>
  );
}
