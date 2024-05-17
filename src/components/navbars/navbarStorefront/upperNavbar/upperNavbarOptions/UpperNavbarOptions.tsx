'use client';

import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import NavbarTitle from '@/components/navbars/NavbarTitle';

type Props = {
  children: ReactNode;
};

export default function UpperNavbarOptions({ children }: Props) {
  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <NavDrawer />
      </Box>
      <Box
        component="nav"
        sx={{ display: { xs: 'block', md: 'none' } }}>
        <NavbarTitle
          component="h3"
          variant="h5"
          color={(theme) => theme.palette.custom.navbar.upper.text}
        />
      </Box>
      {children}
    </>
  );
}
