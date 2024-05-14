'use client';

import { NAV_OPTIONS_ACCOUNT, NAV_OPTIONS_DEFAULT } from '@/data';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import NavbarTitle from '@/components/ui/NavbarTitle';

export default function LowerNavbarOptions() {
  const theme = useTheme();
  const pathname = usePathname();
  const isAdminPath = pathname.includes('/admin');
  const isAccountView = pathname.includes('/account') || pathname.includes('/orders') || pathname.includes('/wishlist');
  const showDefaultNavOptions = !isAdminPath && !isAccountView;

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        position: 'relative',
        height: '56px',
      }}>
      <Box sx={{ position: 'absolute', left: 0 }}>
        <NavbarTitle
          variant="h6"
          display="flex"
          color={theme.palette.custom.navbar.lower.text}
        />
      </Box>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {showDefaultNavOptions
          ? NAV_OPTIONS_DEFAULT.map((option, index) => {
              const isLastNavOption = NAV_OPTIONS_DEFAULT.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.label}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}

        {isAccountView
          ? NAV_OPTIONS_ACCOUNT.map((option, index) => {
              const isLastNavOption = NAV_OPTIONS_ACCOUNT.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.label}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}
      </List>
    </Box>
  );
}
