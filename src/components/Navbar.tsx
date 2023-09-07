'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import AccountMenu from './AccountMenu';
import TemporaryDrawer from './TemporaryDrawer';
import NavbarOptions from './NavbarOptions';
import DrawerNavContent from './DrawerNavContent';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Button, Tooltip } from '@mui/material';
import { ShoppingBasket, Menu, ShoppingCart } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';

const isAdminView = false;
const isAuthUser = true;
const user = {
  // role: 'admin',
  role: 'customer',
};

function Navbar() {
  const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);
  const dispatch = useAppDispatch();

  const handleDrawer = (anchor: DrawerAnchor) => {
    dispatch(setIsDrawerOpen({ [anchor]: !isDrawerOpen[anchor] }));
  };
  return (
    <AppBar
      sx={{ backgroundColor: 'navbar.background' }}
      elevation={0}
      position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <ShoppingBasket sx={{ mr: 1, color: 'navbar.icon' }} />
            <Typography
              tabIndex={-1}
              variant="h6"
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
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              sx={{ color: 'navbar.icon' }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => handleDrawer('left')}>
              <Menu />
            </IconButton>
            <TemporaryDrawer>
              <DrawerNavContent
                isAuthUser={isAuthUser}
                user={user}
              />
            </TemporaryDrawer>
          </Box>
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
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
          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <NavbarOptions user={user} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthUser ? (
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
                  user={user}
                  isAdminView={isAdminView}
                />
              </>
            ) : (
              <Link
                tabIndex={-1}
                href={'/signin'}>
                <Button sx={{ my: 2, color: 'navbar.text', display: 'block' }}>Sign In</Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
