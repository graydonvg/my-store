import AdminOrdersPageClient from '@/components/adminView/AdminOrdersPageClient';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import calculateTablePagination from '@/utils/calculateTablePagination';
import { getOrdersQueryDataForAdmin } from '@/utils/getQueryData';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page, rowsPerPage, queryStart, queryEnd, sortBy, sortDirection } = getOrdersQueryDataForAdmin(searchParams);

  const { orders, totalRowCount } = await getOrdersForAdmin(queryStart, queryEnd, sortBy, sortDirection);

  const { isEndOfData, lastPageNumber } = calculateTablePagination(orders, queryStart, rowsPerPage, totalRowCount);

  return (
    <AdminOrdersPageClient
      page={page}
      rowsPerPage={rowsPerPage}
      orders={orders}
      isEndOfData={isEndOfData}
      lastPageNumber={lastPageNumber}
      totalRowCount={totalRowCount}
    />
  );
}
