'use client';

import { ReactNode } from 'react';
import { useMediaQuery, useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout } from '@mui/icons-material';
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
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const router = useRouter();

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  async function handleSignOut() {
    const { success, message } = await signOut();
    if (success === false) {
      toast.error(message);
    }
    router.refresh();
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
                    color: color.grey.light,
                  }}>
                  {currentUser?.first_name ?? 'User'}
                </Typography>
                <ArrowDropDown sx={{ color: color.blue.dark, marginLeft: 2 }} />
              </>
            }>
            {renderMenuItem(
              <AccountCircle
                fontSize={iconSize}
                sx={{ color: iconColor }}
              />,
              'My Account'
            )}
            {currentUser?.is_admin
              ? renderMenuItem(
                  <AdminViewToggleIcon isAdminView={isAdminView} />,
                  isAdminView ? <Link href={'/'}>Client View</Link> : <Link href={'/admin-view'}>Admin View</Link>
                )
              : renderMenuItem(
                  <ViewList
                    fontSize={iconSize}
                    sx={{ color: iconColor }}
                  />,
                  'Orders'
                )}
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
        </>
      ) : null}
    </>
  );
}
