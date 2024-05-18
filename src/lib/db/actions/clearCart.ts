import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function clearCart() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('userId', authUser?.id ?? '');

  if (error) {
    return { success: false, message: 'Failed to clear cart.' };
  }

  return { success: true, message: 'Cart cleared successfully.' };
}
