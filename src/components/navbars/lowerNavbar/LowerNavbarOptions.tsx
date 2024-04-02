import { ACCOUNT_NAV_OPTIONS, DEFAULT_NAV_OPTIONS } from '@/config';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import NavbarTitleAndLogo from '@/components/ui/NavbarTitleAndLogo';
import useColorPalette from '@/hooks/useColorPalette';

export default function LowerNavbarOptions() {
  const colorPalette = useColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');
  const isAccountView = pathname.includes('/account') || pathname.includes('/orders') || pathname.includes('/wishlist');
  const showDefaultNavOptions = !isAdminView && !isAccountView;

  return (
    <Box
      component="nav"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: 0 }}>
        <NavbarTitleAndLogo
          variant="h6"
          display="flex"
          color={colorPalette.navBar.lower.text}
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
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}

        {/* {isAdminView
          ? ADMIN_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ADMIN_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null} */}

        {isAccountView
          ? ACCOUNT_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ACCOUNT_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
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
