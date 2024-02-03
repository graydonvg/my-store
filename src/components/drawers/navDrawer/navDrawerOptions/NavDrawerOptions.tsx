'use client';

import { List, Box } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawerOption from '../navDrawerOption/NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/SignOutButton';
import { ACCOUNT_NAV_OPTIONS, ADMIN_NAV_OPTIONS, NAV_OPTIONS } from '@/config';
import NavDrawerOptionsThemeButton from './NavDrawerOptionsThemeButton';

export default function NavDrawerOptions() {
  const colorPalette = useColorPalette();
  const userData = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  function handleCloseDrawer() {
    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        {userData && userData?.isAdmin ? (
          <NavDrawerOption
            onClick={handleCloseDrawer}
            label={isAdminView ? 'Client View' : 'Admin View'}
            path={isAdminView ? '/' : '/admin-view/all-products'}
            bodyTextColor={colorPalette.navBar.lower.text}
          />
        ) : null}

        {userData && userData?.isAdmin && isAdminView
          ? ADMIN_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={handleCloseDrawer}
                key={option.id}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))
          : null}

        {!isAdminView
          ? NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={handleCloseDrawer}
                key={option.id}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))
          : null}

        {userData ? (
          <>
            {ACCOUNT_NAV_OPTIONS.map((option) => (
              <NavDrawerOption
                onClick={handleCloseDrawer}
                key={option.id}
                label={option.label}
                path={option.path}
                bodyTextColor={colorPalette.navBar.lower.text}
              />
            ))}
            <SignOutButton showNavDrawerButton={true} />
          </>
        ) : null}
        <NavDrawerOptionsThemeButton />
      </List>
    </Box>
  );
}
