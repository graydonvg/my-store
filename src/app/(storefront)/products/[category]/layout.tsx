import { ReactNode } from 'react';
import { Container } from '@mui/material';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
