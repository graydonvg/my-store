'use client';

import { List, Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
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
  const customColorPalette = useCustomColorPalette();

  return options.map((option) => (
    <NavDrawerOption
      onClick={onClick}
      key={option.id}
      label={option.label}
      path={option.path}
      bodyTextColor={customColorPalette.navBar.lower.text}
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

function ThemeButton() {
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <ListItem
        disablePadding
        sx={{ height: '56px' }}>
        <ListItemButton
          onClick={handleToggleTheme}
          sx={{ width: 1, height: '100%' }}>
          <ListItemText
            primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
            sx={{ color: customColorPalette.navBar.lower.text }}
          />
          <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center' }}>
            <ThemeToggleIcon
              color={customColorPalette.navBar.lower.text}
              size={'small'}
            />
          </Box>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
}

export default function NavDraweOptions() {
  const userData = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  function handleCloseDrawer() {
    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  return (
    <Box component="nav">
      <List disablePadding>
        <AdminNavOptions
          show={!!userData && userData?.isAdmin}
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
          show={!!userData && userData?.isAdmin && isAdminView}
          onClick={handleCloseDrawer}
        />
        <ClientViewNavOptions
          show={!isAdminView}
          onClick={handleCloseDrawer}
        />
        <UserSignedInOptions
          show={!!userData}
          handleCloseDrawer={handleCloseDrawer}
        />
        <ThemeButton />
      </List>
    </Box>
  );
}
