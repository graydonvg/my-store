import { ReactNode } from 'react';
import WelcomePageFormContainer from '@/components/ui/containers/WelcomePageContainer';
import WelcomePageNavbar from '@/components/navbars/WelcomePageNavbar';
import { Container } from '@mui/material';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WelcomePageNavbar />
      <Container
        maxWidth="lg"
        sx={{ paddingY: { xs: 2, sm: 6 } }}>
        <WelcomePageFormContainer>{children}</WelcomePageFormContainer>
      </Container>
    </>
  );
}
