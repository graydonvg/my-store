'use client';

import { List, ListItem, ListItemButton, ListItemText, Divider, Box, useTheme } from '@mui/material';
import DrawerNavOption from './NavDrawerOption';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { navOptions } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

const drawerWidth = '100vw';

export default function NavDraweOptions() {
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';

  function handleSignOut() {
    signOutUser();
    dispatch(setIsDrawerOpen({ left: false }));
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
              label={'My account'}
              path={'/user/account'}
              drawerWidth={drawerWidth}
              bodyTextColor={bodyTextColor}
            />
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
      </List>
    </Box>
  );
}
