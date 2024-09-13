import ProductsPageSidebar from '@/components/productsPageStorefront/ProductsPageSidebar';
import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 122,
          left: 0,
          flexBasis: '240px',
          flexShrink: 0,
          maxHeight: '870px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: { xs: 'none', md: 'block' },
        }}>
        <ProductsPageSidebar />
      </Box>

      <Container
        component="main"
        disableGutters>
        {children}
      </Container>
    </Box>
  );
}
