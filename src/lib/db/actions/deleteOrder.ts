import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function deleteOrder(orderId: number) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('orderId', orderId)
    .eq('userId', authUser?.id ?? '');

  if (error) {
    return { success: false, message: 'Failed to delete order.' };
  }

  return { success: true, message: 'Order deleted successfully.' };
}
