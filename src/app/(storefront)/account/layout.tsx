import { ReactNode } from 'react';
import { Container } from '@mui/material';

type Props = {
  children: ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return (
    <Container
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
