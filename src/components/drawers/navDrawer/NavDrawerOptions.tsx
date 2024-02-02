'use client';

import { List, Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawerOption from './NavDrawerOption';
import SignOutButton from '@/components/ui/buttons/SignOutButton';
import { ACCOUNT_NAV_OPTIONS, ADMIN_NAV_OPTIONS, NAV_OPTIONS } from '@/config';

type OptionsType = {
  id: string;
  label: string;
  path?: string;
}[];

type NavOptionsProps = {
  options: OptionsType;
  onClick: () => void;
};

function NavOptions({ options, onClick }: NavOptionsProps) {
  const colorPalette = useColorPalette();

  return options.map((option) => (
    <NavDrawerOption
      onClick={onClick}
      key={option.id}
      label={option.label}
      path={option.path}
      bodyTextColor={colorPalette.navBar.lower.text}
    />
  ));
}

type AdminNavOptionsProps = {
  options: OptionsType;
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
      options={NAV_OPTIONS}
      onClick={onClick}
    />
  );
}

type UserSignedInOptionsProps = {
  show: boolean;
  handleCloseDrawer: () => void;
};

function UserSignedInOptions({ show, handleCloseDrawer }: UserSignedInOptionsProps) {
  if (!show) return null;

  return (
    <>
      <NavOptions
        options={ACCOUNT_NAV_OPTIONS}
        onClick={handleCloseDrawer}
      />
      <SignOutButton showNavDrawerButton={true} />
    </>
  );
}

function ThemeButton() {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
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
            sx={{ color: colorPalette.navBar.lower.text }}
          />
          <Box sx={{ width: 24, height: 24, display: 'grid', placeItems: 'center' }}>
            <ThemeToggleIcon
              color={colorPalette.navBar.lower.text}
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
    dispatch(setIsNavDrawerOpen(false));
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
              path: isAdminView ? '/' : '/admin-view/all-products',
            },
          ]}
          onClick={handleCloseDrawer}
        />
        <AdminNavOptions
          options={ADMIN_NAV_OPTIONS}
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
