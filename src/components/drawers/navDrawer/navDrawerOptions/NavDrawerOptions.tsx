import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import { CONSTANTS } from '@/constants';
import ThemeButtonNavDrawerOptions from './ThemeButtonNavDrawerOptions';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import SignOutButtonWrapper from '@/components/SignOutButtonWrapper';

export default function NavDrawerOptions() {
  const userData = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  function closeDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  async function signOutAndCloseDrawer(signOutUser: () => Promise<void>) {
    await signOutUser();

    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {CONSTANTS.HAS_ADMIN_PANEL_ACCESS.includes(userData?.role!) || isAdminPath ? (
          <NavDrawerOption
            onClick={closeDrawer}
            label={isAdminPath ? 'Storefront' : 'Admin Panel'}
            path={isAdminPath ? '/' : '/admin/dashboard'}
          />
        ) : null}

        {isAdminPath
          ? CONSTANTS.ADMIN_PANEL_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {!isAdminPath
          ? CONSTANTS.STOREFRONT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData && !isAdminPath
          ? CONSTANTS.ACCOUNT_VIEW_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={closeDrawer}
                key={option.label}
                label={option.label}
                path={option.path}
              />
            ))
          : null}

        {userData || isAdminPath ? (
          <SignOutButtonWrapper>
            {({ signOutUser }) => {
              return (
                <NavDrawerOption
                  onClick={() => signOutAndCloseDrawer(signOutUser)}
                  label="Sign Out"
                />
              );
            }}
          </SignOutButtonWrapper>
        ) : null}

        {!isAdminPath ? <ThemeButtonNavDrawerOptions /> : null}
      </List>
    </Box>
  );
}
