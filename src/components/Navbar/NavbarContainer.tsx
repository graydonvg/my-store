import { ReactNode } from 'react';
import { AppBar, Container } from '@mui/material';

type NavbarContainerProps = {
  backgroundColor: 'upperNavbar.background' | 'lowerNavbar.background';
  children: ReactNode;
};

export default function NavbarContainer({ children, backgroundColor }: NavbarContainerProps) {
  return (
    <AppBar
      component="div"
      elevation={0}
      position="sticky"
      sx={{ backgroundColor }}>
      <Container maxWidth="lg">{children}</Container>
    </AppBar>
  );
}
