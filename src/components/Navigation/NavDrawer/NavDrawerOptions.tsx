'use client';

import { List, ListItem, ListItemButton, ListItemText, Divider, Box, useTheme, ListItemIcon } from '@mui/material';
import DrawerNavOption from './NavDrawerOption';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { navOptions } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname } from 'next/navigation';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';

const drawerWidth = '100vw';

export default function NavDraweOptions() {
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');

  function handleSignOut() {
    signOutUser();
    dispatch(setIsDrawerOpen({ left: false }));
  }

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <Box component="nav">
      <List
        disablePadding
        sx={{ width: drawerWidth }}>
        {navOptions.map((option) => (
          <DrawerNavOption
            key={option.id}
            label={option.label}
            path={option.path}
            drawerWidth={drawerWidth}
            bodyTextColor={bodyTextColor}
          />
        ))}
        {currenUser ? (
          <>
            <DrawerNavOption
              key={'myAccount'}
              label={'My Account'}
              path={'/user/account'}
              drawerWidth={drawerWidth}
              bodyTextColor={bodyTextColor}
            />
            {currenUser.isAdmin ? (
              isAdminView ? (
                <DrawerNavOption
                  key={'clientView'}
                  label={'Client View'}
                  path={'/'}
                  drawerWidth={drawerWidth}
                  bodyTextColor={bodyTextColor}
                />
              ) : (
                <DrawerNavOption
                  key={'adminView'}
                  label={'Admin View'}
                  path={'/admin-view'}
                  drawerWidth={drawerWidth}
                  bodyTextColor={bodyTextColor}
                />
              )
            ) : null}
            <ListItem
              sx={{ width: drawerWidth }}
              disablePadding
              onClick={handleSignOut}>
              <ListItemButton>
                <ListItemText
                  primary={'Sign Out'}
                  sx={{ color: bodyTextColor }}
                />
                <ArrowForwardIosIcon sx={{ color: bodyTextColor }} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ) : null}
        <ListItem
          sx={{ color: bodyTextColor, justifyContent: 'center', marginTop: 8 }}
          onClick={changeTheme}>
          <ListItemIcon sx={{ minWidth: 'unset', marginRight: 2 }}>
            <ThemeIcon
              color={bodyTextColor}
              size={'small'}
            />
          </ListItemIcon>
          {mode === 'dark' ? 'Light' : 'Dark'} Mode
        </ListItem>
      </List>
    </Box>
  );
}
