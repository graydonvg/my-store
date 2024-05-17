import { ReactNode } from 'react';
import { Container } from '@mui/material';
import StorefrontNavbar from '@/components/navbars/navbarStorefront/StorefrontNavbar';

export default function LayoutStorefront({ children }: { children: ReactNode }) {
  return (
    <>
      <StorefrontNavbar />
      <Container
        component="main"
        sx={{
          paddingY: { xs: 2, sm: 3 },
        }}
        maxWidth="lg">
        {children}
      </Container>
    </>
  );
}
