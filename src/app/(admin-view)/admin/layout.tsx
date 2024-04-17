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
    <>
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
            component="main"
            disableGutters
            sx={{
              padding: { xs: 1, sm: 2 },
            }}>
            {children}
          </Container>
        </>
      )}
    </>
  );
}
