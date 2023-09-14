'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, Toolbar, IconButton, useTheme } from '@mui/material';
import { Menu, ShoppingCart } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import AccountMenu from '../AccountMenu';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { upperNavbarPrimaryIconStyles } from '@/lib/styles';
import CustomButton from '../ui/CustomButton';
import UpperNavbarOptionsContainer from './UpperNavbarOptionsContainer';
import NavbarTitleAndLogo from './NavbarTitleAndLogo';
import NavbarContainer from './NavbarContainer';

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
    <NavbarContainer backgroundColor="upperNavbar.background">
      <Toolbar
        disableGutters
        sx={{
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          height: { xs: '64px', md: '42px' },
        }}>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            sx={upperNavbarPrimaryIconStyles}
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
        <Box sx={{ display: 'flex', height: 1 }}>
          {currenUser ? (
            <>
              <UpperNavbarOptionsContainer>
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
              </UpperNavbarOptionsContainer>
              <AccountMenu />
            </>
          ) : (
            <UpperNavbarOptionsContainer>
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
              <CustomButton
                onClick={() => handleModal('signIn')}
                textColor="upperNavbar.text"
                hoverBackgroundColor="upperNavbar.background"
                content="Sign In"
              />
            </UpperNavbarOptionsContainer>
          )}
        </Box>
      </Toolbar>
    </NavbarContainer>
  );
}
