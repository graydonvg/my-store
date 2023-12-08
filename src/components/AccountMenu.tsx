'use client';

import { ReactNode } from 'react';
import { useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout, Favorite } from '@mui/icons-material';
import { ThemeToggleIcon } from './ui/ThemeToggleIcon';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import HoverDropdownMenu from './ui/HoverDropdownMenu';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminViewToggleIcon } from './ui/AdminViewToggleIcon';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import signOut from '@/services/auth/sign-out';

const iconColor = 'custom.grey.light';
const iconSize = 'small';

function renderMenuItem(icon: ReactNode, text: ReactNode, onClick?: () => void) {
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
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const router = useRouter();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  async function handleSignOut() {
    try {
      const { success, message } = await signOut();
      if (success === false) {
        toast.error(message);
      } else {
        toast.success(message);
        router.refresh();
      }
    } catch (error) {
      toast.error('Sign out failed. An unexpected error occured.');
    }
  }

  return (
    <HoverDropdownMenu
      label={
        <>
          <Typography
            component="span"
            sx={{
              color: customColorPalette.grey.light,
            }}>
            {currentUser?.first_name ?? currentUser?.email.split('@')[0]}
          </Typography>
          <ArrowDropDown sx={{ color: customColorPalette.blue.dark, marginLeft: 2 }} />
        </>
      }>
      {currentUser?.is_admin ? (
        <Link href={isAdminView ? '/' : '/admin-view'}>
          {renderMenuItem(
            <AdminViewToggleIcon isAdminView={isAdminView} />,
            isAdminView ? 'Client View' : 'Admin View'
          )}
        </Link>
      ) : null}
      {[
        {
          label: 'My Account',
          href: '/account',
          icon: (
            <AccountCircle
              fontSize={iconSize}
              sx={{ color: iconColor }}
            />
          ),
        },
        {
          label: 'Orders',
          href: '/orders',
          icon: (
            <ViewList
              fontSize={iconSize}
              sx={{ color: iconColor }}
            />
          ),
        },
        {
          label: 'Wishlist',
          href: '/wishlist',
          icon: (
            <Favorite
              fontSize={iconSize}
              sx={{ color: iconColor }}
            />
          ),
        },
      ].map((item) => (
        <Link
          key={item.label}
          href={item.href}>
          {renderMenuItem(item.icon, item.label)}
        </Link>
      ))}
      {renderMenuItem(
        <ThemeToggleIcon
          color={iconColor}
          size={iconSize}
        />,
        `${mode === 'dark' ? 'Light' : 'Dark'} Mode`,
        handleToggleTheme
      )}
      {renderMenuItem(
        <Logout
          fontSize={iconSize}
          sx={{ color: iconColor }}
        />,
        'Sign Out',
        handleSignOut
      )}
    </HoverDropdownMenu>
  );
}
