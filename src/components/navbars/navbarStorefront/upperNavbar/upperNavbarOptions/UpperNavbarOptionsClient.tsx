'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import NavbarTitle from '@/components/ui/NavbarTitle';

type Props = {
  children: ReactNode;
};

export default function UpperNavbarOptionsClient({ children }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'space-between', md: 'flex-end' },
        height: { xs: '64px', md: '40px' },
      }}>
      {isBelowMedium ? <NavDrawer /> : null}

      <Box component="nav">
        <NavbarTitle
          variant="h5"
          display={{ xs: 'flex', md: 'none' }}
          color={theme.palette.custom.navbar.upper.text}
        />
      </Box>

      <Box sx={{ height: 1 }}>{children}</Box>
    </Box>
  );
}
