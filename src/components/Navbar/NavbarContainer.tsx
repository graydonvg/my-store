import { ReactNode } from 'react';
import { AppBar, Container } from '@mui/material';

type NavbarContainerProps = {
  backgroundColor: 'upperNavbar.background' | 'lowerNavbar.background';
  children: ReactNode;
};

export default function NavbarContainer({ children, backgroundColor }: NavbarContainerProps) {
  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{ backgroundColor }}>
      <Container maxWidth="lg">{children}</Container>
    </AppBar>
  );
}
