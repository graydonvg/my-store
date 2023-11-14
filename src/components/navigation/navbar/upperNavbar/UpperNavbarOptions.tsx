'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import ShoppingCartButton from '../../../ui/ShoppingCartButton';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import { Fragment } from 'react';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Menu } from '@mui/icons-material';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import DrawerComponent from '@/components/ui/DrawerComponent';
import NavDrawerContent from '../../navDrawer/NavDrawerContent';
import { useSearchParams } from 'next/navigation';
import ModalComponent from '@/components/ui/ModalComponent';
import SignInForm from '@/components/forms/SignInForm';
import SignUpForm from '@/components/forms/SignUpForm';
import useOpenModal from '@/hooks/useOpenModal';

function renderButton(label: string, color: CustomColorPaletteReturnType, onClick: () => void) {
  return (
    <Typography
      variant="button"
      sx={{
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
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const searchParams = useSearchParams();
  const modal = searchParams.get('modal');
  const handleOpenModal = useOpenModal();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleOpenNavDrawer() {
    dispatch(setIsNavDrawerOpen({ left: true }));
  }

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          minWidth: { xs: '52px', sm: '124px' },
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
              {[ShoppingCartButton, AccountMenu].map((Component, index) => (
                <Fragment key={index}>
                  {index === 0 && renderDivider()}
                  <ListItem disablePadding>
                    <Component />
                  </ListItem>
                  {renderDivider()}
                </Fragment>
              ))}
            </List>
          </>
        ) : (
          <List
            sx={{ display: 'flex', gap: 2, height: '100%' }}
            disablePadding>
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
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
            <ListItem disablePadding>{renderButton('Sign in', color, () => handleOpenModal('sign-in'))}</ListItem>
            <ModalComponent isOpen={modal === 'sign-in'}>
              <SignInForm />
            </ModalComponent>
            {renderDivider()}
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
              {renderButton('Sign Up', color, () => handleOpenModal('sign-up'))}
            </ListItem>
            <ModalComponent isOpen={modal === 'sign-up'}>
              <SignUpForm />
            </ModalComponent>
            {renderDivider()}
          </List>
        )}
      </Box>
    </>
  );
}
