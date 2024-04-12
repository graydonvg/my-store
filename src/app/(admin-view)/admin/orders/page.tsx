import AdminOrdersPageClient from '@/components/adminView/AdminOrdersPageClient';
import { BORDER_RADIUS } from '@/config';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { Paper } from '@mui/material';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = searchParams['page'] ?? 1;
  const rowsPerPage = searchParams['per_page'] ?? 5;

  const start = (Number(page) - 1) * Number(rowsPerPage);
  const end = start + (Number(rowsPerPage) - 1);

  const orders = await getOrdersForAdmin(start, end);

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
