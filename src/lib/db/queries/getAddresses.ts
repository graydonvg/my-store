import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function getAddresses() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      addresses: null,
    };
  }

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: true });

  if (!addresses) {
    return {
      addresses: null,
    };
  }

  return { addresses };
}
