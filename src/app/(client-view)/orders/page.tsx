import OrdersPageClient from '@/components/ordersPageClient/OrdersPageClient';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Box } from '@mui/material';

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, isPaid, orderItems!inner(orderItemId, quantity, size, pricePaid, product: products!inner(productId, name, category, returnInfo, productImageData!inner(imageUrl, index))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode)'
    )
    .order('createdAt', { ascending: false });

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      <OrdersPageClient orders={orders} />
    </Box>
  );
}
