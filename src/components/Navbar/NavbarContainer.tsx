import { ReactNode } from 'react';
import { Container } from '@mui/material';

type NavbarContainerProps = {
  backgroundColor: 'upperNavbar.background' | 'lowerNavbar.background';
  children: ReactNode;
};

export default function NavbarContainer({ children, backgroundColor }: NavbarContainerProps) {
  return (
    <Container
      sx={{ backgroundColor }}
      maxWidth="lg">
      {children}
    </Container>
  );
}
