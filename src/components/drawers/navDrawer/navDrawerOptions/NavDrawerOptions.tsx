import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/SignOutButton';
import { ACCOUNT_NAV_OPTIONS, DEFAULT_NAV_OPTIONS } from '@/config';
import ThemeButtonNavDrawerOptions from './ThemeButtonNavDrawerOptions';
import { ADMIN_NAV_OPTIONS } from '@/components/AdminNavOptions';

export default function NavDrawerOptions() {
  const colorPalette = useColorPalette();
  const userData = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');

  function closeDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {userData && userData?.isAdmin && isAdminView
          ? ADMIN_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))
          : null}

        {!isAdminView
          ? DEFAULT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))
          : null}

        {userData && !isAdminView
          ? ACCOUNT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))
          : null}

        {userData && userData?.isAdmin ? (
          <NavDrawerOption
            onClick={closeDrawer}
            label={isAdminView ? 'Client View' : 'Admin View'}
            path={isAdminView ? '/' : '/admin/dashboard'}
            bodyTextColor={colorPalette.navBar.lower.text}
          />
        ) : null}

        {userData ? <SignOutButton showNavDrawerButton={true} /> : null}

        {!isAdminView ? <ThemeButtonNavDrawerOptions /> : null}
      </List>
    </Box>
  );
}
