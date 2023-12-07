import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { redirect } from 'next/navigation';

type Props = {};

export default async function NotAuthorized() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect('/');

  return <div>Not Authorized!</div>;
}
