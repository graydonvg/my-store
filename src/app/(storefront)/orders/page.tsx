import OrdersPageStorefront from '@/components/ordersPageStorefront/OrdersPageStorefront';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { fetchOrdersForUser } from '@/lib/db/queries/fetchOrders';
import { calculatePagination } from '@/utils/calculate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${CONSTANTS.STORE_NAME} - Orders`,
};

type Props = {
  searchParams: {
    page: string;
  };
};

export default async function OrdersPage({ searchParams: { page } }: Props) {
  const MAX_ORDERS_PER_PAGE = 5;
  const pageNumber = typeof Number(page) === 'number' ? Number(page) : 1;
  const result = await fetchOrdersForUser({ pageNumber, ordersPerPage: MAX_ORDERS_PER_PAGE });
  const { isEndOfData, lastPageNumber } = calculatePagination(
    result.orders,
    { number: pageNumber, rows: MAX_ORDERS_PER_PAGE },
    result.totalRowCount
  );

  return (
    <>
      <PageHeaderWithBorder label="Orders" />
      {result.orders ? (
        <OrdersPageStorefront
          orders={result.orders}
          pageNumber={pageNumber}
          isEndOfData={isEndOfData}
          lastPageNumber={lastPageNumber}
          maxOrdersPerPage={MAX_ORDERS_PER_PAGE}
          totalRowCount={result.totalRowCount}
        />
      ) : null}
    </>
  );
}
