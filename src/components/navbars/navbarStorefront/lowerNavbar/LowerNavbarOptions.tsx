'use client';

import { ACCOUNT_VIEW_NAV_OPTIONS, STORE_VIEW_NAV_OPTIONS } from '@/data';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import NavbarTitle from '../../NavbarTitle';

export default function LowerNavbarOptions() {
  const pathname = usePathname();
  const isAccountView =
    pathname.startsWith('/account') || pathname.startsWith('/orders') || pathname.startsWith('/wishlist');

  return (
    <>
      <Box sx={{ position: 'absolute', left: 0 }}>
        <NavbarTitle
          component="h3"
          variant="h6"
          color={(theme) => theme.palette.custom.navbar.lower.text}
        />
      </Box>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isAccountView
          ? STORE_VIEW_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = STORE_VIEW_NAV_OPTIONS.length - 1 === index;

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
