import OrdersPageStorefront from '@/components/ordersPageStorefront/OrdersPageStorefront';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { fetchOrdersForUser } from '@/lib/db/queries/fetchOrders';
import { Box } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${CONSTANTS.STORE_NAME} - Orders`,
};

export default async function OrdersPage() {
  const orders = await fetchOrdersForUser();

  return (
    <Box>
      <PageHeaderWithBorder label="Orders" />
      {orders ? <OrdersPageStorefront orders={orders} /> : null}
    </Box>
  );
}
