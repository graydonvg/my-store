import { ReactNode } from 'react';
import { Container } from '@mui/material';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      sx={{
        paddingTop: { xs: 1.75, sm: 0 },
        paddingX: { xs: 1.75, sm: 1 },
      }}
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
