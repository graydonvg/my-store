import { ReactNode } from 'react';
import { Container } from '@mui/material';
import Navbar from '@/components/navbars/Navbar';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
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
  );
}
