import { navOptions, adminNavOptions } from '@/lib/utils';
import LowerNavbarOption from './LowerNavbarOption';
import Divider from '@mui/material/Divider';
import { Box, List } from '@mui/material';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';

export default function LowerNavbarOptions() {
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');

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
