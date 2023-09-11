'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ShoppingBasket, Menu, ShoppingCart } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import AccountMenu from './AccountMenu';
import DrawerComponent from './Drawer';
import NavbarOptions from './NavbarOptions';
import NavDrawerContent from './NavDrawerContent';
import ModalComponent from './Modal';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { useEffect } from 'react';
import { navbarButtonStyles } from '@/lib/styles';

type NavbarUpperProps = {
  isAdminView: boolean;
  user: { role: string };
};

export default function NavbarUpper({ isAdminView, user }: NavbarUpperProps) {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  function openDrawer(anchor: DrawerAnchor) {
    dispatch(setIsDrawerOpen({ [anchor]: true }));
  }

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <AppBar
      elevation={0}
      position="static"
      color="secondary">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          variant="regular"
          sx={{ justifyContent: { xs: 'space-between', md: 'flex-end', height: '42px' } }}>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              sx={{ color: 'navbar.icon' }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => openDrawer('left')}>
              <Menu />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <ShoppingBasket sx={{ marginRight: 1, color: 'navbar.icon' }} />
            <Typography
              tabIndex={-1}
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'navbar.text',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            {currenUser ? (
              <>
                {user?.role !== 'admin' ? (
                  <Tooltip
                    title="Shopping cart"
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 5],
                          },
                        },
                      ],
                    }}>
                    <IconButton
                      size="large"
                      sx={{ color: 'navbar.icon' }}>
                      <ShoppingCart aria-label="Shopping cart" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <AccountMenu
                  userRole={user}
                  isAdminView={isAdminView}
                />
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {mode === 'dark' ? (
                  <IconButton
                    onClick={changeTheme}
                    size="small"
                    sx={{ color: 'navbar.icon' }}>
                    <Brightness7Icon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={changeTheme}
                    size="small"
                    sx={{ color: 'navbar.icon' }}>
                    <Brightness4Icon fontSize="small" />
                  </IconButton>
                )}
                <Button
                  onClick={() => handleModal('signIn')}
                  disableTouchRipple
                  sx={{ ...navbarButtonStyles, margin: 0 }}>
                  Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
