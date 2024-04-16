import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import NavDrawerOptions from './navDrawerOptions/NavDrawerOptions';
import DrawerComponent from '@/components/drawers/DrawerComponent';
import { Menu } from '@mui/icons-material';
import { useEffect } from 'react';
import DrawerHeader from '../DrawerHeader';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';

export default function NavDrawer() {
  const dispatch = useAppDispatch();
  const isNavDrawerOpen = useAppSelector((state) => state.navDrawer.isNavDrawerOpen);
  const { isCartOpen } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));
  const navbarHeight = document.getElementById('navbar')?.offsetHeight;

  useEffect(() => {
    isBelowMedium ? dispatch(setIsNavDrawerOpen(false)) : null;
  }, [isBelowMedium, dispatch]);

  function openNavDrawer() {
    dispatch(setIsNavDrawerOpen(true));
    if (isCartOpen) {
      dispatch(setIsCartOpen(false));
    }
  }

  function closeNavDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <>
      <IconButton
        size="small"
        sx={{
          padding: 0,
          color: (theme) => theme.palette.custom.navBar.upper.text,
          cursor: 'pointer',
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        }}
        aria-label="open navigation drawer"
        onClick={openNavDrawer}>
        <Menu />
      </IconButton>
      <DrawerComponent
        width="100vw"
        isOpen={{ left: isNavDrawerOpen }}
        zIndex={theme.zIndex.appBar + 1}
        closeDrawer={closeNavDrawer}>
        <DrawerHeader
          label="Menu"
          onClick={closeNavDrawer}
          height={navbarHeight}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: 1 }}>
          <NavDrawerOptions />
        </Box>
      </DrawerComponent>
    </>
  );
}
