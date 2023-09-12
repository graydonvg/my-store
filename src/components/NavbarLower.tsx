'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { AppBar, Box, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { ShoppingBasket, Menu } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';
import NavbarOptions from './NavbarOptions';

type NavbarLowerProps = { user: { role: string } };

export default function NavbarLower({ user }: NavbarLowerProps) {
  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor: 'navbarLower.background' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingBasket sx={{ mr: 1, color: 'navbarLower.icon' }} />
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
                color: 'navbarLower.text',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NavbarOptions user={user} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
