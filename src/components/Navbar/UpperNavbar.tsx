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
  Divider,
} from '@mui/material';
import { ShoppingBasket, Menu, ShoppingCart } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import AccountMenu from '../AccountMenu';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import {
  navbarAndNavDrawerHeaderHeightXs,
  upperNavbarButtonStyles,
  upperNavbarOptions,
  upperNavbarPrimaryIconStyles,
} from '@/lib/styles';

export default function UpperNavbar() {
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
      sx={{ backgroundColor: 'upperNavbar.background' }}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          variant="regular"
          sx={{
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: navbarAndNavDrawerHeaderHeightXs, md: '42px' },
          }}>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              sx={upperNavbarPrimaryIconStyles}
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => openDrawer('left')}>
              <Menu />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <ShoppingBasket sx={{ marginRight: 1, color: 'upperNavbar.secondaryIcon' }} />
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
                color: 'upperNavbar.text',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', height: 1 }}>
            {currenUser ? (
              <>
                <Box
                  component="button"
                  sx={upperNavbarOptions}>
                  <ShoppingCart aria-label="Shopping cart" />
                  <Box
                    sx={{
                      backgroundColor: 'upperNavbar.secondaryIcon',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'grid',
                      placeContent: 'center',
                    }}>
                    2
                  </Box>
                </Box>
                <AccountMenu />
              </>
            ) : (
              <Box sx={upperNavbarOptions}>
                {mode === 'dark' ? (
                  <IconButton
                    onClick={changeTheme}
                    size="small"
                    sx={upperNavbarPrimaryIconStyles}>
                    <Brightness4Icon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={changeTheme}
                    size="small"
                    sx={upperNavbarPrimaryIconStyles}>
                    <Brightness7Icon fontSize="small" />
                  </IconButton>
                )}
                <Button
                  onClick={() => handleModal('signIn')}
                  disableTouchRipple
                  sx={{ ...upperNavbarButtonStyles }}>
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
