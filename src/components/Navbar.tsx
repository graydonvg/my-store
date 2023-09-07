'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import AccountMenu from './AccountMenu';
import TemporaryDrawer from './TemporaryDrawer';
import NavbarOptions from './NavbarOptions';
import DrawerNavContent from './DrawerNavContent';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Button, Tooltip, useTheme } from '@mui/material';
import { ShoppingBasket, Menu, ShoppingCart } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import ModalComponent from './Modal';
import SignIn from './SignIn';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import SignUp from './SignUp';

const isAdminView = false;
const isAuthUser = false;
const user = {
  // role: 'admin',
  role: 'customer',
};

function Navbar() {
  const modalContent = useAppSelector((state) => state.modal.modalContent);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function changeTheme() {
    dispatch(toggleTheme());
  }

  const openDrawer = (anchor: DrawerAnchor) => {
    dispatch(setIsDrawerOpen({ [anchor]: true }));
  };

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

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
              onClick={() => openDrawer('left')}>
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
          <Box sx={{ display: 'flex', gap: { xs: 0, md: 2 }, alignItems: 'center' }}>
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
              <>
                {mode === 'dark' ? (
                  <IconButton
                    onClick={changeTheme}
                    size="large"
                    sx={{ color: 'navbar.icon' }}>
                    <Brightness7Icon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={changeTheme}
                    size="large"
                    sx={{ color: 'navbar.icon' }}>
                    <Brightness4Icon fontSize="small" />
                  </IconButton>
                )}
                <Button
                  onClick={() => handleModal('signIn')}
                  sx={{
                    my: 2,
                    color: 'navbar.text',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    '&:hover': { backgroundColor: 'inherit' },
                  }}>
                  Sign In
                </Button>
                <ModalComponent>
                  {modalContent === 'signIn' ? <SignIn /> : modalContent === 'signUp' ? <SignUp /> : null}
                </ModalComponent>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
