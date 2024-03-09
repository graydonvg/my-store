import AdminNavbar from '@/components/navbars/AdminNavbar';
import { Box, Container, Toolbar } from '@mui/material';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AdminNavbar />
      <Toolbar sx={{ width: 72, display: { xs: 'none', sm: 'block' } }} />
      <Container
        disableGutters
        maxWidth="lg"
        sx={{ paddingY: 2, paddingX: 4 }}>
        <Toolbar />
        {children}
      </Container>
    </Box>
  );
}
