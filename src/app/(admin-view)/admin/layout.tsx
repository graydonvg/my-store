'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode, useState } from 'react';
import Navbar from '@/components/navbars/Navbar';
import useColorPalette from '@/hooks/useColorPalette';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const mode = theme.palette.mode;
  const colorPalette = useColorPalette();

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <>
      {!isBelowMedium ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: mode === 'dark' ? 'black' : colorPalette.shade.light,
          }}>
          <AdminNavbar
            toggleDrawer={toggleDrawer}
            open={open}>
            {children}
          </AdminNavbar>
        </Box>
      ) : (
        <>
          <Navbar />
          <Container
            sx={{
              paddingY: { xs: 2, sm: 3 },
              backgroundColor: mode === 'dark' ? 'black' : colorPalette.shade.light,
            }}>
            {children}
          </Container>
        </>
      )}
    </>
  );
}
