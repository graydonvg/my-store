import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function fetchAddresses() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: true });

  return { addresses };
}
