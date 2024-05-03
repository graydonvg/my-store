import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/SignOutButton';
import { ACCOUNT_NAV_OPTIONS, DEFAULT_NAV_OPTIONS } from '@/config';
import ThemeButtonNavDrawerOptions from './ThemeButtonNavDrawerOptions';
import { ADMIN_NAV_OPTIONS } from '@/components/AdminNavOptions';

export default function NavDrawerOptions() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');

  function closeDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {userData?.role === 'admin' || userData?.role === 'manager' ? (
          <NavDrawerOption
            onClick={closeDrawer}
            label={isAdminView ? 'Client View' : 'Admin View'}
            path={isAdminView ? '/' : '/admin/dashboard'}
          />
        ) : null}

        {isAdminView
          ? ADMIN_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
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
              />
            ))
          : null}

        {userData ? <SignOutButton buttonVariant="temporaryDrawer" /> : null}

        {!isAdminView ? <ThemeButtonNavDrawerOptions /> : null}
      </List>
    </Box>
  );
}
