'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import ShoppingCartButton from '../../../ui/ShoppingCartButton';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import { ComponentType, Fragment } from 'react';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import { setDrawerContent, setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Menu } from '@mui/icons-material';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';

function renderDivider() {
  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{ backgroundColor: 'custom.grey.medium' }}
      flexItem
    />
  );
}

function renderButton(label: string, color: CustomColorPaletteReturnType, onClick: () => void) {
  return (
    <ListItem disablePadding>
      <Typography
        variant="button"
        sx={{ color: color.grey.light, cursor: 'pointer', whiteSpace: 'nowrap' }}
        onClick={onClick}>
        {label}
      </Typography>
    </ListItem>
  );
}

function renderComponent(Component: ComponentType, index: number, isBelowMedium: boolean) {
  return (
    <Fragment key={index}>
      {index === 0 && !isBelowMedium && renderDivider()}
      <ListItem disablePadding>
        <Component />
      </ListItem>
      {!isBelowMedium && renderDivider()}
    </Fragment>
  );
}

export default function UpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  function handleOpenNavDrawer() {
    dispatch(setDrawerContent('nav'));
    dispatch(setIsDrawerOpen({ left: true }));
  }

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          minWidth: { xs: '52px', md: '124px' },
        }}>
        <Menu
          sx={{
            color: color.grey.light,
            cursor: 'pointer',
          }}
          aria-label="open navigation drawer"
          onClick={handleOpenNavDrawer}
        />
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={color.grey.light}
      />
      <Box component="nav">
        {currentUser ? (
          <List
            sx={{ display: 'flex', height: '100%' }}
            disablePadding>
            {[ShoppingCartButton, AccountMenu].map((Component, index) =>
              renderComponent(Component, index, isBelowMedium)
            )}
          </List>
        ) : (
          <List sx={{ display: 'flex', gap: 2, height: '100%' }}>
            {!isBelowMedium && (
              <ListItem disablePadding>
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
            )}
            {!isBelowMedium ? renderDivider() : null}
            {renderButton('Sign in', color, () => handleModal('signIn'))}
            {!isBelowMedium ? renderDivider() : null}
            {!isBelowSmall ? renderButton('Sign Up', color, () => handleModal('signUp')) : null}
            {!isBelowMedium ? renderDivider() : null}
          </List>
        )}
      </Box>
    </>
  );
}
