import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';

export default async function fetchOrderTotalsThisMonth() {
  const supabase = await createSupabaseServerClient();

  const startOfMonth = dayjs().startOf('month');
  const now = dayjs();

  const { data: orderTotalsThisMonth } = await supabase
    .from('orders')
    .select('createdAt, orderTotal')
    .or('orderStatus.eq.paid, orderStatus.eq.processing, orderStatus.eq.shipped, orderStatus.eq.delivered')
    .gte('createdAt', startOfMonth)
    .lte('createdAt', now);

  return orderTotalsThisMonth;
}
