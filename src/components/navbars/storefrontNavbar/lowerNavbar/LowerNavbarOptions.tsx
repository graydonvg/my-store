'use client';

import LowerNavbarOption from './LowerNavbarOption';
import { Box, List, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import NavbarTitle from '../../NavbarTitle';
import { ACCOUNT_VIEW_NAV_OPTIONS, STOREFRONT_NAV_OPTIONS } from '@/constants';

export default function LowerNavbarOptions() {
  const theme = useTheme();
  const pathname = usePathname();
  const isAccountView =
    pathname.startsWith('/account') || pathname.startsWith('/orders') || pathname.startsWith('/wishlist');

  return (
    <>
      <Box sx={{ position: 'absolute', left: 0 }}>
        <NavbarTitle
          component="h3"
          variant="h6"
          color={theme.palette.custom.navbar.lower.text}
        />
      </Box>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isAccountView
          ? STOREFRONT_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = STOREFRONT_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.label}
                  label={option.label}
                  path={option.path}
                  showDividerRight={!isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : ACCOUNT_VIEW_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ACCOUNT_VIEW_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.label}
                  label={option.label}
                  path={option.path}
                  showDividerRight={!isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })}
      </List>
    </>
  );
}
