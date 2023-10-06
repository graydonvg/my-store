'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavDraweOptions from './NavDrawerOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function NavDrawerContent() {
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const upperNavbarHeight = document.getElementById('upper-nav')?.offsetHeight;

  function handleCloseNavDrawer() {
    dispatch(setIsDrawerOpen({ left: false }));
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: color.grey.dark,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          height: upperNavbarHeight,
          paddingX: 2,
        }}>
        <Typography
          color={color.grey.light}
          variant="h5"
          component="span">
          Menu
        </Typography>
        <CloseIcon
          sx={{
            cursor: 'pointer',
            padding: 0,
            color: color.grey.light,
            '&:hover': { backgroundColor: color.grey.dark },
          }}
          aria-label="close navigation drawer"
          onClick={handleCloseNavDrawer}
        />
      </Box>
      <NavDraweOptions />
    </>
  );
}
