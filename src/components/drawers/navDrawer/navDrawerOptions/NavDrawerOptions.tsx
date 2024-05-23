import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/complex/SignOutButton';
import { constants } from '@/constants';
import ThemeButtonNavDrawerOptions from './ThemeButtonNavDrawerOptions';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { adminPanelNavOptions } from '@/components/AdminPanelNavOptions';

export default function NavDrawerOptions() {
  const userData = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  function closeDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {constants.hasAdminPanelAccess.includes(userData?.role!) || isAdminPath ? (
          <NavDrawerOption
            onClick={closeDrawer}
            label={isAdminPath ? 'Storefront' : 'Admin Panel'}
            path={isAdminPath ? '/' : '/admin/dashboard'}
          />
        ) : null}

        {isAdminPath
          ? adminPanelNavOptions.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {!isAdminPath
          ? constants.storeFrontNavOptions.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData && !isAdminPath
          ? constants.accountViewNavOptions.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData || isAdminPath ? <SignOutButton buttonVariant="temporaryDrawer" /> : null}

        {!isAdminPath ? <ThemeButtonNavDrawerOptions /> : null}
      </List>
    </Box>
  );
}
