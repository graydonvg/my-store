'use client';

import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import NavbarTitle from '@/components/navbars/NavbarTitle';
import NavDrawerButton from '@/components/NavDrawerButton';

type Props = {
  children?: ReactNode;
};

export default function UpperNavbarOptions({ children }: Props) {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <NavDrawerButton />
        <NavDrawer />
      </Box>
      <Box
        component="nav"
        sx={{ display: { xs: 'block', md: 'none' } }}>
        <NavbarTitle
          component="h3"
          variant="h5"
          color={theme.palette.custom.navbar.upper.text}
        />
      </Box>
      {children}
    </>
  );
}
