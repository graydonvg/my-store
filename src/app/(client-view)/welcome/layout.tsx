import { ReactNode } from 'react';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import WelcomePageContainer from '@/components/ui/containers/WelcomePageContainer';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <CommonLayoutContainer>
      <WelcomePageContainer>{children}</WelcomePageContainer>
    </CommonLayoutContainer>
  );
}
