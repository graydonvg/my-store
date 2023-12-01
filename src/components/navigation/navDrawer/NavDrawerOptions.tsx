'use client';

import { List, Box, useTheme, Button } from '@mui/material';
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

function renderNavOptions(
  options: { id: string; label: string; path: string }[],
  bodyTextColor: string,
  onClick: () => void
) {
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

  return (
    <>
      <Box component="nav">
        <List disablePadding>
          {currentUser?.is_admin && isAdminView
            ? renderNavOptions(adminNavOptions, bodyTextColor, handleCloseDrawer)
            : renderNavOptions(navOptions, bodyTextColor, handleCloseDrawer)}
          {currentUser && (
            <>
              <NavDrawerOption
                onClick={handleCloseDrawer}
                key={'myAccount'}
                label={'My Account'}
                path={'/user/account'}
                bodyTextColor={bodyTextColor}
              />
              {currentUser.is_admin && (
                <NavDrawerOption
                  onClick={handleCloseDrawer}
                  key={'adminView'}
                  label={isAdminView ? 'Client View' : 'Admin View'}
                  path={isAdminView ? '/' : '/admin-view'}
                  bodyTextColor={bodyTextColor}
                />
              )}
              <NavDrawerOption
                onClick={handleSignOut}
                key={'signOut'}
                label={'Sign Out'}
                bodyTextColor={bodyTextColor}
              />
            </>
          )}
        </List>
      </Box>
      <Button
        sx={{ color: bodyTextColor, justifyContent: 'center', width: 'fit-content', margin: '64px auto' }}
        onClick={handleToggleTheme}>
        <ThemeToggleIcon
          color={bodyTextColor}
          size={'small'}
        />
        <Box sx={{ width: 10 }} />
        {mode === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </>
  );
}
