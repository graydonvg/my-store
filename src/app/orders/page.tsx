import Orders from '@/components/Orders';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Box } from '@mui/material';

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'created_at, order_id, cart_total, discount_total, delivery_fee, order_total, is_paid ,order_items(order_item_id, product_id, quantity, size, price_paid, product_image_url, product_name, return_details), shipping_details(full_name, contact_number,complex_or_building, street_address, suburb, province, city, postal_code)'
    )
    .order('created_at', { ascending: false });

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      <Orders
        show={!!orders}
        orders={orders!}
      />
    </Box>
  );
}
