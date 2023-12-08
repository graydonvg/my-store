import { ReactNode } from 'react';
import { Container } from '@mui/material';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <Container
      sx={{
        paddingTop: { xs: 1.75, sm: 2 },
        paddingX: { xs: 0.75, sm: 0 },
      }}
      disableGutters
      maxWidth="lg">
      {children}
    </Container>
  );
}
