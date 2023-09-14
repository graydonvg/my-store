'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import {
  Box,
  IconButton,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Toolbar,
} from '@mui/material';
import DrawerNavOption from './NavDrawerOption';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { navOptions } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase';
import { navbarAndNavDrawerHeaderHeightXs, upperNavbarPrimaryIconStyles } from '@/lib/styles';

export default function NavDrawerContent() {
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
      <Toolbar
        variant="regular"
        sx={{
          backgroundColor: 'navDrawer.headerBackground',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}>
        <Typography
          color="navDrawer.headerText"
          variant="h5"
          component="span">
          Menu
        </Typography>
        <IconButton
          size="small"
          sx={{ ...upperNavbarPrimaryIconStyles }}
          aria-label="open drawer"
          onClick={() => closeDrawer('left', false)}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <List
        disablePadding
        sx={{ width: '100vw' }}>
        {navOptions.map((option) => (
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
              <ListItemButton>
                <ListItemText
                  primary={'Sign Out'}
                  sx={{ color: 'navDrawer.bodyText' }}
                />
                <ArrowForwardIosIcon sx={{ color: 'navDrawer.bodyText' }} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ) : null}
      </List>
    </>
  );
}
