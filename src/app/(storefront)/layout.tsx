import { ReactNode } from 'react';
import { Container } from '@mui/material';
import StorefrontNavbar from '@/components/navbars/storefrontNavbar/StorefrontNavbar';

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StorefrontNavbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          padding: { xs: 2, sm: 3 },
        }}>
        {children}
      </Container>
    </>
  );
}
