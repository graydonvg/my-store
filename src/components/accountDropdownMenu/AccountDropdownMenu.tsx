import { useTheme, Typography } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Favorite, Security } from '@mui/icons-material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/features/theme/themeSlice';
import HoverDropdownMenu from '../ui/HoverDropdownMenu';
import Link from 'next/link';
import AccountDropdownMenuItem from './AccountDropdownMenuItem';
import SignOutButton from '../SignOutButton';
import { HAS_ADMIN_PANEL_ACCESS } from '@/data';

const iconSize = 'small';

const accountMenuOptions = [
  {
    label: 'My Account',
    href: '/account',
    icon: <AccountCircle fontSize={iconSize} />,
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: <ViewList fontSize={iconSize} />,
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: <Favorite fontSize={iconSize} />,
  },
];

export default function AccountDropdownMenu() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  let title = 'Account';

  if (userData?.firstName) {
    title = userData?.firstName;
  } else if (userData?.email) {
    title = userData?.email.split('@')[0];
  }

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <HoverDropdownMenu
      buttonBackgroundColor={theme.palette.custom.navbar.upper.background}
      label={
        <>
          <Typography
            component="span"
            sx={{
              color: 'white',
            }}>
            {title}
          </Typography>
          <ArrowDropDown sx={{ color: theme.palette.primary.main, marginLeft: 1 }} />
        </>
      }>
      {HAS_ADMIN_PANEL_ACCESS.includes(userData?.role!) ? (
        <Link href="/admin/dashboard">
          <AccountDropdownMenuItem
            label="Admin Panel"
            icon={<Security fontSize="small" />}
          />
        </Link>
      ) : null}

      {accountMenuOptions.map((item) => (
        <Link
          key={item.label}
          href={item.href}>
          <AccountDropdownMenuItem
            label={item.label}
            icon={item.icon}
          />
        </Link>
      ))}

      <AccountDropdownMenuItem
        label={`${darkMode ? 'Light' : 'Dark'} Mode`}
        icon={<ThemeToggleIcon size={iconSize} />}
        onClick={changeTheme}
      />
      <SignOutButton
        buttonVariant="accountDropdownMenu"
        accountMenuIconSize={iconSize}
      />
    </HoverDropdownMenu>
  );
}
