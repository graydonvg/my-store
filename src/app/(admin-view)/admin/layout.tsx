'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode, useState } from 'react';
import Navbar from '@/components/navbars/Navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'black' : theme.palette.custom.shade.light),
        minHeight: '100vh',
      }}>
      {!isBelowMedium ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
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
            disableGutters
            sx={{
              padding: 2,
            }}>
            <main>{children}</main>
          </Container>
        </>
      )}
    </Box>
  );
}
