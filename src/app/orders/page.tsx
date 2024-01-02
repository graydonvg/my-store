import Orders from '@/components/Orders';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Box } from '@mui/material';

type Props = {};

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'created_at, order_id, cart_total, discount_total, delivery_fee, order_total ,order_items(order_item_id, product_id, quantity, size, price_paid, product_image_url, product_name, return_details), shipping_details(*)'
    )
    .order('created_at', { ascending: false });

  if (!orders) return null;

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      <Orders orders={orders} />
    </Box>
  );
}
