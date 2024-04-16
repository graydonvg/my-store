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

  const queryStart = (Number(page) - 1) * Number(rowsPerPage);
  const queryEnd = queryStart + (Number(rowsPerPage) - 1);

  const { selectedOrders, totalRowCount } = await getOrdersForAdmin(queryStart, queryEnd, sortBy, sortDirection);

  const selectedOrdersLength = selectedOrders?.length ?? 0;
  const isEndOfData = queryStart + selectedOrdersLength >= totalRowCount;
  const lastPage = Math.ceil(totalRowCount / Number(rowsPerPage));

  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
      }}>
      {/* <Seachbar /> */}
      <AdminOrdersPageClient
        orders={selectedOrders}
        isEndOfData={isEndOfData}
        lastPage={lastPage}
        totalRowCount={totalRowCount}
      />
    </Paper>
  );
}
