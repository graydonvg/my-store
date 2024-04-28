'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode } from 'react';
import Navbar from '@/components/navbars/Navbar';
import { ErrorBoundary } from 'react-error-boundary';
// @ts-ignore
function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

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
          <AdminNavbar>
            <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
          </AdminNavbar>
        </Box>
      ) : (
        <>
          <Navbar />
          <Container
            component="main"
            disableGutters>
            <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
          </Container>
        </>
      )}
    </>
  );
}
