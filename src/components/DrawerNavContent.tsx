'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import DrawerNavOption from './DrawerNavOption';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, List, Typography } from '@mui/material';
import { adminNavOptions, navOptions } from '@/lib/utils';

type DrawerNavContentType = {
  user: {
    role: string;
  };
  isAuthUser: boolean;
};

export default function DrawerNavContent({ user, isAuthUser }: DrawerNavContentType) {
  const dispatch = useAppDispatch();

  function closeDrawer(anchor: string, open: boolean) {
    dispatch(setIsDrawerOpen({ [anchor]: open }));
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'navDrawer.headerBackground',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 68.5,
        }}>
        <Typography
          color="navDrawer.headerText"
          variant="h5"
          component="span"
          sx={{ marginLeft: 1 }}>
          Menu
        </Typography>
        <IconButton
          size="large"
          sx={{ color: 'navDrawer.headerText', marginRight: 1 }}
          onClick={() => closeDrawer('left', false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List
        disablePadding
        sx={{ width: '100vw' }}>
        {user.role === 'admin'
          ? adminNavOptions
              .filter((option) => (isAuthUser ? option : !option.authRequired))
              .map((option) => (
                <DrawerNavOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                />
              ))
          : navOptions
              .filter((option) => (isAuthUser ? option : !option.authRequired))
              .map((option) => (
                <DrawerNavOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                />
              ))}
      </List>
    </>
  );
}
