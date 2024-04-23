import AdminOrdersPageClient from '@/components/adminView/AdminOrdersPageClient';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { OrdersSortByOptions } from '@/types';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = (searchParams['page'] ?? '1') as string;
  const pageNumber = Number(page);
  const rowsPerPage = (searchParams['per_page'] ?? '5') as string;
  const rowsPerPageNumber = Number(rowsPerPage);
  const sortBy = (searchParams['sort_by'] as OrdersSortByOptions) ?? 'date';
  const sortDirection = (searchParams['sort'] as 'asc' | 'desc') ?? 'desc';

  const queryStart = (pageNumber - 1) * rowsPerPageNumber;
  const queryEnd = queryStart + (rowsPerPageNumber - 1);

  const { selectedOrders, totalRowCount } = await getOrdersForAdmin(queryStart, queryEnd, sortBy, sortDirection);

  const selectedOrdersLength = selectedOrders?.length ?? 0;
  const isEndOfData = queryStart + selectedOrdersLength >= totalRowCount;
  const lastPage = Math.ceil(totalRowCount / rowsPerPageNumber);

  return (
    <AdminOrdersPageClient
      page={pageNumber}
      rowsPerPage={rowsPerPageNumber}
      orders={selectedOrders}
      isEndOfData={isEndOfData}
      lastPage={lastPage}
      totalRowCount={totalRowCount}
    />
  );
}
