import { ReactNode } from 'react';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';
import WelcomePageFormContainer from '@/components/ui/containers/WelcomePageContainer';
import NavbarWelcomePage from '@/components/navbars/NavbarWelcomePage';
import { Container } from '@mui/material';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (authUser) {
    redirect('/');
  }

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
