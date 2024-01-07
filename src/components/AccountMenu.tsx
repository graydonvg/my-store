'use client';

import { ReactNode } from 'react';
import { useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout, Favorite } from '@mui/icons-material';
import { ThemeToggleIcon } from './theme/ThemeToggleIcon';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import HoverDropdownMenu from './ui/HoverDropdownMenu';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminViewToggleIcon } from './ui/AdminViewToggleIcon';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import signOut from '@/services/auth/sign-out';
import { borderRadius } from '@/constants/styles';

const iconColor = 'custom.grey.light';
const iconSize = 'small';
const accountMenuOptions = [
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
];

type CustomMenuItemProps = {
  icon: ReactNode;
  text: ReactNode;
  onClick?: () => void;
};

function CustomMenuItem({ icon, text, onClick }: CustomMenuItemProps) {
  return (
    <MenuItem
      sx={{
        borderRadius: borderRadius,
        color: 'custom.grey.light',
        '&:hover': { backgroundColor: 'custom.blue.dark' },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {text}
    </MenuItem>
  );
}

type AdminMenuItemProps = {
  show: boolean;
};

function AdminMenuItem({ show }: AdminMenuItemProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  if (!show) return null;

  return (
    <Link href={isAdminView ? '/' : '/admin-view'}>
      <CustomMenuItem
        text={isAdminView ? 'Client View' : 'Admin View'}
        icon={<AdminViewToggleIcon isAdminView={isAdminView} />}
      />
    </Link>
  );
}

export default function AccountMenu() {
  const userData = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;

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
      buttonBackgroundColor={customColorPalette.grey.dark}
      label={
        <>
          <Typography
            component="span"
            sx={{
              color: customColorPalette.grey.light,
            }}>
            {userData?.firstName ?? userData?.email.split('@')[0] ?? 'Account'}
          </Typography>
          <ArrowDropDown sx={{ color: customColorPalette.blue.dark, marginLeft: 2 }} />
        </>
      }>
      <AdminMenuItem show={!!userData && userData?.isAdmin} />
      {accountMenuOptions.map((item) => (
        <Link
          key={item.label}
          href={item.href}>
          <CustomMenuItem
            text={item.label}
            icon={item.icon}
          />
        </Link>
      ))}
      <CustomMenuItem
        text={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
        icon={
          <ThemeToggleIcon
            color={iconColor}
            size={iconSize}
          />
        }
        onClick={handleToggleTheme}
      />
      <CustomMenuItem
        text={'Sign Out'}
        icon={
          <Logout
            fontSize={iconSize}
            sx={{ color: iconColor }}
          />
        }
        onClick={handleSignOut}
      />
    </HoverDropdownMenu>
  );
}
