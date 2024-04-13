import AdminOrdersPageClient from '@/components/adminView/AdminOrdersPageClient';
import { BORDER_RADIUS } from '@/config';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { OrdersSortByOptions } from '@/types';
import { Paper } from '@mui/material';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = searchParams['page'] ?? '1';
  const rowsPerPage = searchParams['per_page'] ?? '5';
  const sortBy = (searchParams['sort_by'] as OrdersSortByOptions) ?? 'date';
  const sortDirection = (searchParams['sort'] as 'asc' | 'desc') ?? 'desc';

  const start = (Number(page) - 1) * Number(rowsPerPage);
  const end = start + (Number(rowsPerPage) - 1);

  const { orders, totalCount } = await getOrdersForAdmin(start, end, sortBy, sortDirection);

  const ordersLength = orders?.length ?? 0;
  const isEndOfData = start + ordersLength >= totalCount;
  const lastPage = Math.ceil(totalCount / Number(rowsPerPage));

  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
      }}>
      <AdminOrdersPageClient
        orders={orders}
        isEndOfData={isEndOfData}
        lastPage={lastPage}
      />
    </Paper>
  );
}
