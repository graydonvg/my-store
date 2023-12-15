import { Container } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CommonLayoutContainer({ children }: Props) {
  return (
    <Container
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
