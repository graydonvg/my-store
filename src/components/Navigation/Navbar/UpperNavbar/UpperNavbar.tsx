'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, Container } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import UpperNavbarOptions from './UpperNavbarOptions';

export default function UpperNavbar() {
  const dispatch = useAppDispatch();

  function openDrawer(anchor: DrawerAnchor) {
    dispatch(setIsDrawerOpen({ [anchor]: true }));
  }

  return (
    <Box
      id="upper-nav"
      sx={{ backgroundColor: 'custom.grey.dark' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '56px', md: '40px' },
          }}>
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              minWidth: { xs: '52px', sm: '124px' },
            }}>
            <Menu
              sx={{
                color: 'custom.grey.light',
                cursor: 'pointer',
              }}
              aria-label="open navigation drawer"
              onClick={() => openDrawer('left')}
            />
          </Box>
          <NavbarTitleAndLogo
            variant="h5"
            display={{ xs: 'flex', md: 'none' }}
            color="custom.grey.light"
          />
          <UpperNavbarOptions />
        </Box>
      </Container>
    </Box>
  );
}
