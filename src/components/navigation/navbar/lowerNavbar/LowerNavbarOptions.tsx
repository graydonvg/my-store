import { navOptions, adminNavOptions, accountNavOptions } from '@/lib/utils';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LowerNavbarOptions() {
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const isAccountView = pathname.includes('account') || pathname.includes('orders') || pathname.includes('wishlist');

  return (
    <Box
      component="nav"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isAdminView
          ? adminNavOptions.map((option, index) => {
              const isLastNavOption = adminNavOptions.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                />
              );
            })
          : isAccountView
          ? accountNavOptions.map((option, index) => {
              const isLastNavOption = accountNavOptions.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                />
              );
            })
          : navOptions.map((option, index) => {
              const isLastNavOption = navOptions.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                />
              );
            })}
      </List>
    </Box>
  );
}
