'use client';

import { useMediaQuery, useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout } from '@mui/icons-material';
import { ThemeIcon } from './ui/ThemeIcon';
import { signOutUser } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import HoverDropdownMenu from './ui/HoverDropdownMenu';
import { AdminViewIcon } from './ui/AdminViewToggle';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItemStyles = {
  borderRadius: 1,
  color: 'custom.grey.light',
  '&:hover': { backgroundColor: 'custom.blue.dark' },
};
const iconColor = 'custom.grey.light';
const iconSize = 'small';

export default function AccountMenu() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <>
      {!isBelowMedium ? (
        <>
          <HoverDropdownMenu
            menuAnchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            menuTransformOrigin={{ vertical: 'top', horizontal: 'right' }}
            labelContent={
              <>
                <Typography
                  component="span"
                  sx={{
                    color: 'custom.grey.light',
                  }}>
                  {currentUser?.displayName ?? 'Account'}
                </Typography>
                <ArrowDropDown sx={{ color: 'custom.blue.dark', marginLeft: 2 }} />
              </>
            }>
            <MenuItem sx={menuItemStyles}>
              <ListItemIcon>
                <AccountCircle
                  fontSize={iconSize}
                  sx={{ color: iconColor }}
                />
              </ListItemIcon>
              My Account
            </MenuItem>
            {currentUser?.isAdmin ? (
              <MenuItem sx={menuItemStyles}>
                <ListItemIcon>
                  <AdminViewIcon isAdminView={isAdminView} />
                </ListItemIcon>
                {isAdminView ? <Link href={'/'}>Client View</Link> : <Link href={'/admin-view'}>Admin View</Link>}
              </MenuItem>
            ) : (
              <MenuItem sx={menuItemStyles}>
                <ListItemIcon>
                  <ViewList
                    fontSize={iconSize}
                    sx={{ color: iconColor }}
                  />
                </ListItemIcon>
                Orders
              </MenuItem>
            )}
            <MenuItem
              sx={menuItemStyles}
              onClick={changeTheme}>
              <ListItemIcon>
                <ThemeIcon
                  color={iconColor}
                  size={iconSize}
                />
              </ListItemIcon>
              {mode === 'dark' ? 'Light' : 'Dark'} Mode
            </MenuItem>
            <MenuItem
              sx={menuItemStyles}
              onClick={signOutUser}>
              <ListItemIcon>
                <Logout
                  fontSize={iconSize}
                  sx={{ color: iconColor }}
                />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </HoverDropdownMenu>
        </>
      ) : null}
    </>
  );
}
