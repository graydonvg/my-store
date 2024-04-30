import { useTheme, Typography } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Favorite, AdminPanelSettings } from '@mui/icons-material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import HoverDropdownMenu from '../ui/HoverDropdownMenu';
import Link from 'next/link';
import AccountDropdownMenuItem from './AccountDropdownMenuItem';
import SignOutButton from '../ui/buttons/SignOutButton';

export const ICON_COLOR = 'white';
export const ICON_SIZE = 'small';

const accountMenuOptions = [
  {
    label: 'My Account',
    href: '/account',
    icon: (
      <AccountCircle
        fontSize={ICON_SIZE}
        sx={{ color: ICON_COLOR }}
      />
    ),
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: (
      <ViewList
        fontSize={ICON_SIZE}
        sx={{ color: ICON_COLOR }}
      />
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (
      <Favorite
        fontSize={ICON_SIZE}
        sx={{ color: ICON_COLOR }}
      />
    ),
  },
];

export default function AccountDropdownMenu() {
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <HoverDropdownMenu
      buttonBackgroundColor={theme.palette.custom.navBar.upper.background}
      label={
        <>
          <Typography
            component="span"
            sx={{
              color: 'white',
            }}>
            {userData?.firstName ?? userData?.email.split('@')[0] ?? 'Account'}
          </Typography>
          <ArrowDropDown sx={{ color: theme.palette.custom.primary.dark, marginLeft: 1 }} />
        </>
      }>
      {userData && userData?.authLevel > 0 ? (
        <Link href="/admin/dashboard">
          <AccountDropdownMenuItem
            label="Admin View"
            icon={
              <AdminPanelSettings
                fontSize="small"
                sx={{ color: theme.palette.custom.typographyVariants.light }}
              />
            }
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
        label={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
        icon={
          <ThemeToggleIcon
            color={ICON_COLOR}
            size={ICON_SIZE}
          />
        }
        onClick={changeTheme}
      />
      <SignOutButton
        buttonVariant="accountDropdownMenu"
        accountMenuIconColor={ICON_COLOR}
        accountMenuIconSize={ICON_SIZE}
      />
    </HoverDropdownMenu>
  );
}
