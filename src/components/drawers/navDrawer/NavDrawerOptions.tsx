'use client';

import { List, Box, useTheme, ListItemButton, ListItemText, Divider, ListItem } from '@mui/material';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { navOptions, adminNavOptions } from '@/lib/utils';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavDrawerOption from './NavDrawerOption';
import { toast } from 'react-toastify';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';

export default function NavDraweOptions() {
  const supabase = createSupabaseBrowserClient();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const router = useRouter();

  function handleCloseDrawer() {
    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Sign out failed. ${error.message}.`);
    }
    router.refresh();
    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function renderNavOptions(options: { id: string; label: string; path?: string }[], onClick?: () => void) {
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

  return (
    <>
      <Box component="nav">
        <List disablePadding>
          {currentUser?.is_admin && isAdminView
            ? renderNavOptions(adminNavOptions, handleCloseDrawer)
            : renderNavOptions(navOptions, handleCloseDrawer)}
          {currentUser && (
            <>
              {currentUser.is_admin
                ? renderNavOptions(
                    [
                      {
                        id: 'adminView',
                        label: isAdminView ? 'Client View' : 'Admin View',
                        path: isAdminView ? '/' : '/admin-view',
                      },
                    ],
                    handleCloseDrawer
                  )
                : null}
              {renderNavOptions(
                [
                  {
                    id: 'myAccount',
                    label: 'My Account',
                    path: '/account',
                  },
                  {
                    id: 'orders',
                    label: 'Orders',
                    path: '/orders',
                  },
                  {
                    id: 'wishlist',
                    label: 'Wishlist',
                    path: '/wishlist',
                  },
                ],
                handleCloseDrawer
              )}
              {renderNavOptions(
                [
                  {
                    id: 'signOut',
                    label: 'Sign Out',
                  },
                ],
                handleSignOut
              )}
            </>
          )}
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
