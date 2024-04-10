import OrdersPageClient from '@/components/ordersPageClient/OrdersPageClient';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import getOrders from '@/lib/db/queries/getOrders';
import { Box } from '@mui/material';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      <OrdersPageClient orders={orders} />
    </Box>
  );
}
