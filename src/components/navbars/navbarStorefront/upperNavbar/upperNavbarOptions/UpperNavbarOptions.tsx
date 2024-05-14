'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import NavbarTitle from '../../../../ui/NavbarTitle';
import NavDrawer from '../../../../drawers/navDrawer/NavDrawer';
import UnauthenticatedUpperNavbarOptions from './UnauthenticatedUpperNavbarOptions';
import AuthenticatedUpperNavbarOptions from './AuthenticatedUpperNavbarOptions';

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.data);
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

      <NavbarTitle
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={theme.palette.custom.navbar.upper.text}
      />

      <Box sx={{ height: 1 }}>
        {!userData ? <UnauthenticatedUpperNavbarOptions /> : null}
        {userData ? <AuthenticatedUpperNavbarOptions /> : null}
      </Box>
    </Box>
  );
}
