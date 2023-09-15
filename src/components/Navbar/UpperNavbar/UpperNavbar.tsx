'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, Toolbar, IconButton, Divider, AppBar, Container, List, ListItem } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../../ui/CustomButton';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import ShoppingCart from './ShoppingCart';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import AccountMenu from '@/components/AccountMenu';

const iconButtonStyles = {
  color: 'upperNavbar.primaryIcon',
  '&:hover': { backgroundColor: 'upperNavbar.background' },
};

const dividerStyles = { display: { xs: 'none', md: 'block' } };

export default function UpperNavbar() {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector((state) => state.user.currentUser);

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
      component="div"
      elevation={0}
      position="sticky"
      sx={{ backgroundColor: 'upperNavbar.background', zIndex: 2 }}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '64px', md: '42px' },
          }}>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              sx={iconButtonStyles}
              size="small"
              aria-label="open navigation drawer"
              onClick={() => openDrawer('left')}>
              <Menu />
            </IconButton>
          </Box>
          <NavbarTitleAndLogo
            variant="h5"
            display={{ xs: 'flex', md: 'none' }}
            color="upperNavbar.text"
          />
          <Box
            component="nav"
            sx={{ height: 1 }}>
            {currenUser ? (
              <List
                sx={{ display: 'flex', height: 1 }}
                disablePadding>
                <Divider
                  sx={dividerStyles}
                  orientation="vertical"
                  flexItem
                />
                <ListItem disablePadding>
                  <ShoppingCart />
                </ListItem>
                <Divider
                  sx={dividerStyles}
                  orientation="vertical"
                  flexItem
                />
                <ListItem disablePadding>
                  <AccountMenu />
                </ListItem>
                <Divider
                  sx={dividerStyles}
                  orientation="vertical"
                  flexItem
                />
              </List>
            ) : (
              <List sx={{ display: 'flex', gap: 2, height: 1 }}>
                <ListItem disablePadding>
                  <IconButton
                    onClick={changeTheme}
                    size="small"
                    sx={iconButtonStyles}>
                    <ThemeIcon
                      size="small"
                      color="upperNavbar.primaryIcon"
                    />
                  </IconButton>
                </ListItem>
                <ListItem disablePadding>
                  <CustomButton
                    onClick={() => handleModal('signIn')}
                    textColor="upperNavbar.text"
                    hoverBackgroundColor="upperNavbar.background">
                    Sign in
                  </CustomButton>
                </ListItem>
              </List>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
