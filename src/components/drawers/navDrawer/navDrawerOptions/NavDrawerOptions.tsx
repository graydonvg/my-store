import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/SignOutButton';
import { ACCOUNT_NAV_OPTIONS, DEFAULT_NAV_OPTIONS, HAS_ADMIN_PANEL_ACCESS } from '@/data';
import ThemeButtonNavDrawerOptions from './ThemeButtonNavDrawerOptions';
import { ADMIN_PANEL_NAV_OPTIONS } from '@/components/AdminPanelNavOptions';

export default function NavDrawerOptions() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminPath = pathname.includes('/admin');

  function closeDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {HAS_ADMIN_PANEL_ACCESS.includes(userData?.role!) ? (
          <NavDrawerOption
            onClick={closeDrawer}
            label={isAdminPath ? 'Storefront' : 'Admin Panel'}
            path={isAdminPath ? '/' : '/admin/dashboard'}
          />
        ) : null}

        {isAdminPath
          ? ADMIN_PANEL_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {!isAdminPath
          ? DEFAULT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData && !isAdminPath
          ? ACCOUNT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData ? <SignOutButton buttonVariant="temporaryDrawer" /> : null}

        {!isAdminPath ? <ThemeButtonNavDrawerOptions /> : null}
      </List>
    </Box>
  );
}
