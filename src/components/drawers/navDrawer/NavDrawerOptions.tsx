'use client';

import { List, Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavDrawerOption from './NavDrawerOption';
import { toast } from 'react-toastify';
import { accountNavOptions, adminNavOptions, navOptions } from '@/constants/navigation';
import signOut from '@/services/auth/sign-out';

type NavOptionsType = {
  id: string;
  label: string;
  path?: string;
}[];

type NavOptionsProps = {
  options: NavOptionsType;
  onClick: () => void;
};

function NavOptions({ options, onClick }: NavOptionsProps) {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;

  return options.map((option) => (
    <NavDrawerOption
      onClick={onClick}
      key={option.id}
      label={option.label}
      path={option.path}
      bodyTextColor={bodyTextColor}
    />
  ));
}

type AdminNavOptionsProps = {
  options: NavOptionsType;
  show: boolean;
  onClick: () => void;
};

function AdminNavOptions({ show, options, onClick }: AdminNavOptionsProps) {
  if (!show) return null;

  return (
    <NavOptions
      options={options}
      onClick={onClick}
    />
  );
}

type ClientViewNavOptionsProps = {
  show: boolean;
  onClick: () => void;
};

function ClientViewNavOptions({ show, onClick }: ClientViewNavOptionsProps) {
  if (!show) return null;

  return (
    <NavOptions
      options={navOptions}
      onClick={onClick}
    />
  );
}

type UserSignedInOptionsProps = {
  show: boolean;
  handleCloseDrawer: () => void;
};

function UserSignedInOptions({ show, handleCloseDrawer }: UserSignedInOptionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (!show) return null;

  async function handleSignOut() {
    const { success, message } = await signOut();
    if (success === false) {
      toast.error(message);
    } else {
      toast.success(message);
      router.refresh();
    }

    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  return (
    <>
      <NavOptions
        options={accountNavOptions}
        onClick={handleCloseDrawer}
      />
      <NavOptions
        options={[
          {
            id: 'signOut',
            label: 'Sign Out',
          },
        ]}
        onClick={handleSignOut}
      />
    </>
  );
}

export default function NavDraweOptions() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleCloseDrawer() {
    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  return (
    <>
      <Box component="nav">
        <List disablePadding>
          <AdminNavOptions
            show={!!currentUser && currentUser?.is_admin}
            options={[
              {
                id: 'adminView',
                label: isAdminView ? 'Client View' : 'Admin View',
                path: isAdminView ? '/' : '/admin-view',
              },
            ]}
            onClick={handleCloseDrawer}
          />
          <AdminNavOptions
            options={adminNavOptions}
            show={!!currentUser && currentUser?.is_admin && isAdminView}
            onClick={handleCloseDrawer}
          />
          <ClientViewNavOptions
            show={!isAdminView}
            onClick={handleCloseDrawer}
          />
          <UserSignedInOptions
            show={!!currentUser}
            handleCloseDrawer={handleCloseDrawer}
          />
          <ListItem
            disablePadding
            sx={{ height: '56px' }}>
            <ListItemButton
              onClick={handleToggleTheme}
              sx={{ width: 1, height: '100%' }}>
              <ListItemText
                primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
                sx={{ color: bodyTextColor }}
              />
              <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center' }}>
                <ThemeToggleIcon
                  color={bodyTextColor}
                  size={'small'}
                />
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
      </Box>
    </>
  );
}
