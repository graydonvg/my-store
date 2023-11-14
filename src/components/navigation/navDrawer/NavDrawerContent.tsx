'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import { Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavDraweOptions from './NavDrawerOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function NavDrawerContent() {
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const upperNavbarHeight = document.getElementById('upper-nav')?.offsetHeight;

  function handleCloseNavDrawer() {
    dispatch(setIsNavDrawerOpen({ left: false }));
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
          // position: 'sticky',
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
      <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', width: 1 }}>
        <NavDraweOptions />
      </Box>
    </>
  );
}
