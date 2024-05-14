import OrdersPageStorefront from '@/components/ordersPageStorefront/OrdersPageStorefront';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getOrdersForUser } from '@/lib/db/queries/getOrders';
import { Box } from '@mui/material';

export default async function OrdersPage() {
  const orders = await getOrdersForUser();

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      {orders ? <OrdersPageStorefront orders={orders} /> : null}
    </Box>
  );
}
