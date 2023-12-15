import { ReactNode } from 'react';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';

export default async function WelcomeLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
