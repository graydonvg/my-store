'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import ShoppingCartButton from './ShoppingCartButton';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import AccountMenu from '@/components/AccountMenu';
import { ComponentType, Fragment } from 'react';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import { setDrawerContent, setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Menu } from '@mui/icons-material';

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

function renderButton(label: string, onClick: () => void) {
  return (
    <ListItem disablePadding>
      <Typography
        variant="button"
        sx={{ color: 'custom.grey.light', cursor: 'pointer', whiteSpace: 'nowrap' }}
        onClick={onClick}>
        {label}
      </Typography>
    </ListItem>
  );
}

export default function UpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
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

  function renderComponent(Component: ComponentType, index: number) {
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

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          minWidth: { xs: '52px', sm: '124px' },
        }}>
        <Menu
          sx={{
            color: 'custom.grey.light',
            cursor: 'pointer',
          }}
          aria-label="open navigation drawer"
          onClick={handleOpenNavDrawer}
        />
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color="custom.grey.light"
      />
      <Box component="nav">
        {currentUser ? (
          <List
            sx={{ display: 'flex', height: '100%' }}
            disablePadding>
            {[ShoppingCartButton, AccountMenu].map(function (Component, index) {
              return renderComponent(Component, index);
            })}
          </List>
        ) : (
          <List sx={{ display: 'flex', gap: 2, height: '100%' }}>
            {!isBelowMedium && (
              <ListItem disablePadding>
                <IconButton
                  disableRipple
                  onClick={handleToggleTheme}
                  size="small">
                  <ThemeIcon
                    size="small"
                    color="custom.grey.light"
                  />
                </IconButton>
              </ListItem>
            )}
            {!isBelowMedium ? renderDivider() : null}
            {renderButton('Sign in', () => handleModal('signIn'))}
            {!isBelowMedium ? renderDivider() : null}
            {!isBelowSmall ? renderButton('Sign Up', () => handleModal('signUp')) : null}
          </List>
        )}
      </Box>
    </>
  );
}
