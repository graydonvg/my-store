import { ReactNode } from 'react';
import { Container } from '@mui/material';
import NavbarStorefront from '@/components/navbars/navbarStorefront/NavbarStorefront';

export default function LayoutStorefront({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarStorefront />
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
