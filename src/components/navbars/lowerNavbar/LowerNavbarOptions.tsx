import { ACCOUNT_NAV_OPTIONS, DEFAULT_NAV_OPTIONS } from '@/config';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import NavbarTitle from '@/components/ui/NavbarTitle';

export default function LowerNavbarOptions() {
  const theme = useTheme();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');
  const isAccountView = pathname.includes('/account') || pathname.includes('/orders') || pathname.includes('/wishlist');
  const showDefaultNavOptions = !isAdminView && !isAccountView;

  return (
    <Box
      component="nav"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
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
          ? DEFAULT_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = DEFAULT_NAV_OPTIONS.length - 1 === index;

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
          ? ACCOUNT_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ACCOUNT_NAV_OPTIONS.length - 1 === index;

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
