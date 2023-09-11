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
import NavbarLower from './NavbarLower';
import NavbarUpper from './NavbarUpper';

const isAdminView = false;
const user = {
  // role: 'admin',
  role: 'customer',
};

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    isBelowMedium ? dispatch(setIsDrawerOpen({ left: false })) : null;
  }, [isBelowMedium, dispatch]);

  return (
    <>
      <NavbarUpper
        isAdminView={isAdminView}
        user={user}
      />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <NavbarLower user={user} />
      </Box>
      <ModalComponent />
      <DrawerComponent>
        <NavDrawerContent userRole={user} />
      </DrawerComponent>
    </>
  );
}
