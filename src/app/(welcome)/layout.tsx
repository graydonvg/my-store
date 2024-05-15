import { ReactNode } from 'react';
import WelcomePageFormContainer from '@/components/ui/containers/WelcomePageContainer';
import NavbarWelcomePage from '@/components/navbars/NavbarWelcomePage';
import { Container } from '@mui/material';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarWelcomePage />
      <Container
        maxWidth="lg"
        sx={{ paddingY: { xs: 2, sm: 6 } }}>
        <WelcomePageFormContainer>{children}</WelcomePageFormContainer>
      </Container>
    </>
  );
}
