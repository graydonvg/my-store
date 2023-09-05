'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import AccountMenu from './AccountMenu';
import { adminNavOptions, navOptions } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DrawerAnchor } from '@/types';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import TemporaryDrawer from './TemporaryDrawer';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Divider } from '@mui/material';

const isAdminView = false;
const isAuthUser = true;
const user = {
  // role: 'admin'
  role: 'customer',
};

function NavOptions() {
  return (
    <>
      {user.role === 'admin'
        ? adminNavOptions
            .filter((option) => !option.temporaryDrawerOnly)
            .map((option) => (
              <Link
                tabIndex={-1}
                key={option.id}
                href={option.path}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>{option.label}</Button>
              </Link>
            ))
        : navOptions
            .filter((option) => !option.temporaryDrawerOnly)
            .map((option) => (
              <Link
                tabIndex={-1}
                key={option.id}
                href={option.path}>
                <Button
                  key={option.id}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  {option.label}
                </Button>
              </Link>
            ))}
    </>
  );
}

function DrawerNavOptions() {
  return (
    <Box sx={{ width: '100vw' }}>
      {user.role === 'admin'
        ? adminNavOptions
            .filter((option) => (isAuthUser ? option : option.id !== 'myAccount' && option.id !== 'signOut'))
            .map((option) => (
              <Link
                tabIndex={-1}
                key={option.id}
                href={option.path}>
                <Button
                  key={option.id}
                  sx={{ color: 'black', display: 'flex', justifyContent: 'space-between', width: 1, margin: 0 }}>
                  {option.label}
                  <ArrowForwardIosIcon />
                </Button>
                <Divider />
              </Link>
            ))
        : navOptions
            .filter((option) => (isAuthUser ? option : option.id !== 'myAccount' && option.id !== 'signOut'))
            .map((option) => (
              <Link
                tabIndex={-1}
                key={option.id}
                href={option.path}>
                <Button
                  key={option.id}
                  sx={{ color: 'black', display: 'flex', justifyContent: 'space-between', width: 1, margin: 0 }}>
                  {option.label}
                  <ArrowForwardIosIcon />
                </Button>
                <Divider />
              </Link>
            ))}
    </Box>
  );
}

function Navbar() {
  const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);
  const dispatch = useAppDispatch();

  const handleDrawer = (anchor: DrawerAnchor) => {
    dispatch(setIsDrawerOpen({ [anchor]: !isDrawerOpen[anchor] }));
  };
  return (
    <AppBar
      elevation={0}
      position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <ShoppingBasketIcon sx={{ mr: 1 }} />
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
                color: 'inherit',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => handleDrawer('left')}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <TemporaryDrawer content={<DrawerNavOptions />} />
          </Box>
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <ShoppingBasketIcon sx={{ marginRight: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <NavOptions />
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
                    <IconButton color="inherit">
                      <ShoppingCartIcon aria-label="Shopping cart" />
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
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>Sign In</Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
