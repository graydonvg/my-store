'use client';

import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  useTheme,
  ListItemIcon,
  Button,
  IconButton,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import DrawerNavOption from './NavDrawerOption';
import { signOutUser } from '@/lib/firebase';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { navOptions, adminNavOptions } from '@/lib/utils';

export default function NavDraweOptions() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const drawerWidth = '100vw';

  function handleCloseDrawer() {
    dispatch(setIsDrawerOpen({ left: false }));
  }

  function handleSignOut() {
    signOutUser();
    dispatch(setIsDrawerOpen({ left: false }));
  }

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function renderNavOptions(options: { id: string; label: string; path: string }[]) {
    return options.map((option) => (
      <DrawerNavOption
        key={option.id}
        label={option.label}
        path={option.path}
        drawerWidth={drawerWidth}
        bodyTextColor={bodyTextColor}
      />
    ));
  }

  return (
    <>
      <Box component="nav">
        <List
          disablePadding
          sx={{ width: drawerWidth }}>
          {currentUser?.isAdmin && isAdminView ? renderNavOptions(adminNavOptions) : renderNavOptions(navOptions)}
          {currentUser && (
            <>
              <DrawerNavOption
                onClick={handleCloseDrawer}
                key={'myAccount'}
                label={'My Account'}
                path={'/user/account'}
                drawerWidth={drawerWidth}
                bodyTextColor={bodyTextColor}
              />
              {currentUser.isAdmin && (
                <DrawerNavOption
                  onClick={handleCloseDrawer}
                  key={'adminView'}
                  label={isAdminView ? 'Client View' : 'Admin View'}
                  path={isAdminView ? '/' : '/admin-view'}
                  drawerWidth={drawerWidth}
                  bodyTextColor={bodyTextColor}
                />
              )}
              <DrawerNavOption
                onClick={handleSignOut}
                key={'signOut'}
                label={'Sign Out'}
                drawerWidth={drawerWidth}
                bodyTextColor={bodyTextColor}
              />
            </>
          )}
        </List>
      </Box>
      <Button
        sx={{ color: bodyTextColor, justifyContent: 'center', width: 'fit-content', margin: '64px auto' }}
        onClick={handleToggleTheme}>
        <ThemeIcon
          color={bodyTextColor}
          size={'small'}
        />
        <Box sx={{ width: 10 }} />
        {mode === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </>
  );
}
