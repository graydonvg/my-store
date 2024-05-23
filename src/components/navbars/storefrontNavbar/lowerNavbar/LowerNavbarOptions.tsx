'use client';

import { constants } from '@/constants';
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
          ? constants.storeFrontNavOptions.map((option, index) => {
              const isLastNavOption = constants.storeFrontNavOptions.length - 1 === index;

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
          : constants.accountViewNavOptions.map((option, index) => {
              const isLastNavOption = constants.accountViewNavOptions.length - 1 === index;

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
