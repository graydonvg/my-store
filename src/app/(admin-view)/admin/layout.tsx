'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode, useState } from 'react';
import Navbar from '@/components/navbars/Navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('md'));

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <>
      {!isBelowSmall ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            }}
            maxWidth="lg">
            {children}
          </Container>
        </>
      )}
    </>
  );
}
