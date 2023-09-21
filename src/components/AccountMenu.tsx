'use client';

import { ReactNode } from 'react';
import { useMediaQuery, useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout } from '@mui/icons-material';
import { ThemeIcon } from './ui/ThemeIcon';
import { signOutUser } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import HoverDropdownMenu from './ui/HoverDropdownMenu';
import { AdminViewToggle } from './ui/AdminViewToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const iconColor = 'custom.grey.light';
const iconSize = 'small';

function generateMenuItem(icon: ReactNode, text: ReactNode, onClick?: () => void) {
  return (
    <MenuItem
      sx={{
        borderRadius: 1,
        color: 'custom.grey.light',
        '&:hover': { backgroundColor: 'custom.blue.dark' },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {text}
    </MenuItem>
  );
}

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
            {generateMenuItem(
              <AccountCircle
                fontSize={iconSize}
                sx={{ color: iconColor }}
              />,
              'My Account'
            )}
            {currentUser?.isAdmin
              ? generateMenuItem(
                  <AdminViewToggle isAdminView={isAdminView} />,
                  isAdminView ? <Link href={'/'}>Client View</Link> : <Link href={'/admin-view'}>Admin View</Link>
                )
              : generateMenuItem(
                  <ViewList
                    fontSize={iconSize}
                    sx={{ color: iconColor }}
                  />,
                  'Orders'
                )}
            {generateMenuItem(
              <ThemeIcon
                color={iconColor}
                size={iconSize}
              />,
              `${mode === 'dark' ? 'Light' : 'Dark'} Mode`,
              changeTheme
            )}
            {generateMenuItem(
              <Logout
                fontSize={iconSize}
                sx={{ color: iconColor }}
              />,
              'Sign Out',
              signOutUser
            )}
          </HoverDropdownMenu>
        </>
      ) : null}
    </>
  );
}
