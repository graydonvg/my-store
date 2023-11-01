'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import ShoppingCartButton from '../../../ui/ShoppingCartButton';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import { Fragment } from 'react';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import { setDrawerContent, setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Menu } from '@mui/icons-material';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { ModalContentType } from '@/types';

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
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleModal(content: ModalContentType) {
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
            <ListItem disablePadding>{renderButton('Sign in', color, () => handleModal('signIn'))}</ListItem>
            {renderDivider()}
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
              {renderButton('Sign Up', color, () => handleModal('signUp'))}
            </ListItem>
            {renderDivider()}
          </List>
        )}
      </Box>
    </>
  );
}
