'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import {
  IconButton,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Toolbar,
  Box,
  useTheme,
} from '@mui/material';
import DrawerNavOption from './NavDrawerOption';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { navOptions } from '@/lib/utils';
import { signOutUser } from '@/lib/firebase';

const drawerWidth = '100vw';

export default function NavDrawerContent() {
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const bodyTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const upperNavbarHeight = document.getElementById('upper-nav')?.offsetHeight;

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
          backgroundColor: 'custom.grey.dark',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: upperNavbarHeight,
          paddingX: 2,
        }}>
        <Typography
          color="custom.grey.light"
          variant="h5"
          component="span">
          Menu
        </Typography>
        <CloseIcon
          sx={{
            padding: 0,
            color: 'custom.grey.light',
            '&:hover': { backgroundColor: 'custom.grey.dark' },
          }}
          aria-label="open drawer"
          onClick={() => closeDrawer('left', false)}
        />
      </Box>
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
    </>
  );
}
