'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, IconButton, List, Typography, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import DrawerNavOption from './NavDrawerOption';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { adminNavOptions, navOptions } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase';
import { upperNavbarIconStyles } from '@/lib/styles';

type NavDrawerContentType = {
  userRole: { role: string };
};

export default function NavDrawerContent({ userRole }: NavDrawerContentType) {
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  function closeDrawer(anchor: string, open: boolean) {
    dispatch(setIsDrawerOpen({ [anchor]: open }));
  }

  function handleSignOut() {
    signOutUser();
    dispatch(setIsDrawerOpen({ left: false }));
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'navDrawer.headerBackground',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '42px',
        }}>
        <Typography
          color="navDrawer.headerText"
          variant="h5"
          component="span"
          sx={{ marginLeft: 1 }}>
          Menu
        </Typography>
        <IconButton
          size="small"
          sx={{ ...upperNavbarIconStyles, marginRight: 2 }}
          onClick={() => closeDrawer('left', false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List
        disablePadding
        sx={{ width: '100vw' }}>
        {userRole.role === 'admin'
          ? adminNavOptions.map((option) => (
              <DrawerNavOption
                key={option.id}
                label={option.label}
                path={option.path}
              />
            ))
          : navOptions.map((option) => (
              <DrawerNavOption
                key={option.id}
                label={option.label}
                path={option.path}
              />
            ))}
        {currenUser ? (
          <>
            <DrawerNavOption
              key={'myAccount'}
              label={'My account'}
              path={'/user/account'}
            />
            <ListItem
              disablePadding
              onClick={handleSignOut}>
              <ListItemButton disableGutters>
                <ListItemText
                  primary={'Sign Out'}
                  sx={{ color: 'navDrawer.bodyText', marginLeft: 1 }}
                />
                <ArrowForwardIosIcon sx={{ marginRight: 2, color: 'navDrawer.bodyText' }} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ) : null}
      </List>
    </>
  );
}
