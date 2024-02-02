'use client';

import { useTheme, Typography } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Favorite } from '@mui/icons-material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import HoverDropdownMenu from '../ui/HoverDropdownMenu';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminViewToggleIcon } from '../ui/AdminViewToggleIcon';
import useColorPalette from '@/hooks/useColorPalette';
import AccountMenuItem from './AccountMenuItem';
import { ACCOUNT_MENU_ICON_COLOR, ACCOUNT_MENU_ICON_SIZE } from '@/config';
import SignOutButton from '../ui/buttons/SignOutButton';

const accountMenuOptions = [
  {
    label: 'My Account',
    href: '/account',
    icon: (
      <AccountCircle
        fontSize={ACCOUNT_MENU_ICON_SIZE}
        sx={{ color: ACCOUNT_MENU_ICON_COLOR }}
      />
    ),
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: (
      <ViewList
        fontSize={ACCOUNT_MENU_ICON_SIZE}
        sx={{ color: ACCOUNT_MENU_ICON_COLOR }}
      />
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (
      <Favorite
        fontSize={ACCOUNT_MENU_ICON_SIZE}
        sx={{ color: ACCOUNT_MENU_ICON_COLOR }}
      />
    ),
  },
];

type AdminMenuItemProps = {
  show: boolean;
};

function AdminMenuItem({ show }: AdminMenuItemProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  if (!show) return null;

  return (
    <Link href={isAdminView ? '/' : '/admin-view/all-products'}>
      <AccountMenuItem
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
  const mode = theme.palette.mode;
  const colorPalette = useColorPalette();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <HoverDropdownMenu
      buttonBackgroundColor={colorPalette.navBar.upper.background}
      label={
        <>
          <Typography
            component="span"
            sx={{
              color: 'white',
            }}>
            {userData?.firstName ?? userData?.email.split('@')[0] ?? 'Account'}
          </Typography>
          <ArrowDropDown sx={{ color: colorPalette.primary.dark, marginLeft: 2 }} />
        </>
      }>
      <AdminMenuItem show={!!userData && userData?.isAdmin} />
      {accountMenuOptions.map((item) => (
        <Link
          key={item.label}
          href={item.href}>
          <AccountMenuItem
            text={item.label}
            icon={item.icon}
          />
        </Link>
      ))}
      <AccountMenuItem
        text={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
        icon={
          <ThemeToggleIcon
            color={ACCOUNT_MENU_ICON_COLOR}
            size={ACCOUNT_MENU_ICON_SIZE}
          />
        }
        onClick={handleToggleTheme}
      />
      <SignOutButton showAccountMenuButton={true} />
    </HoverDropdownMenu>
  );
}
