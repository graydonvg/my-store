import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import getServiceSupabase from '@/lib/supabase/getServiceSupabase';

type Props = {};

export default async function AdminUsersPage() {
  const supabase = getServiceSupabase();

  const { data } = await supabase.from('users').select('*');

  return <PageHeaderWithBorder label="Users page coming soon!" />;
}
