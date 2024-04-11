import AdminOrdersPageClient from '@/components/adminView/AdminOrdersPageClient';
import { BORDER_RADIUS } from '@/config';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { Paper } from '@mui/material';

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin(0, 20);

  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
      }}>
      <AdminOrdersPageClient orders={orders} />
    </Paper>
  );
}
