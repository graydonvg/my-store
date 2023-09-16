'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavDraweOptions from './NavDrawerOptions';

export default function NavDrawerContent() {
  const dispatch = useAppDispatch();
  const upperNavbarHeight = document.getElementById('upper-nav')?.offsetHeight;

  function closeDrawer(anchor: string, open: boolean) {
    dispatch(setIsDrawerOpen({ [anchor]: open }));
  }

  return (
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
        aria-label="close navigation drawer"
        onClick={() => closeDrawer('left', false)}
      />
      <NavDraweOptions />
    </Box>
  );
}
