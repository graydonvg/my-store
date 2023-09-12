'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { AppBar, Box, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { ShoppingBasket, Menu } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';
import NavbarOptions from './NavbarOptions';

export default function LowerNavbar() {
  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor: 'lowerNavbar.background' }}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ height: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingBasket sx={{ mr: 1, color: 'lowerNavbar.secondaryIcon' }} />
            <Typography
              tabIndex={-1}
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'lowerNavbar.text',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NavbarOptions />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
