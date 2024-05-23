import OrdersPageStorefront from '@/components/ordersPageStorefront/OrdersPageStorefront';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { fetchOrdersForUser } from '@/lib/db/queries/fetchOrders';
import { Box } from '@mui/material';

export default async function OrdersPage() {
  const orders = await fetchOrdersForUser();

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      {orders ? <OrdersPageStorefront orders={orders} /> : null}
    </Box>
  );
}
