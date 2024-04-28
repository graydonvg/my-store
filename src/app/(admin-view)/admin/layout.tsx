'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode } from 'react';
import Navbar from '@/components/navbars/Navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {!isBelowMedium ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <AdminNavbar>{children}</AdminNavbar>
        </Box>
      ) : (
        <>
          <Navbar />
          <Container
            component="main"
            disableGutters>
            {children}
          </Container>
        </>
      )}
    </>
  );
}
