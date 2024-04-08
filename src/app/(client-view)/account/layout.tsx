import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';

type Props = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: Props) {
  // const supabase = await createSupabaseServerClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) redirect('/welcome/sign-in');

  return <CommonLayoutContainer>{children}</CommonLayoutContainer>;
}
