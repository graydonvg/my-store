import OrdersPageStorefront from '@/components/ordersPageStorefront/OrdersPageStorefront';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { fetchOrdersForUser } from '@/lib/db/queries/fetchOrders';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `${CONSTANTS.STORE_NAME} - Orders`,
};

type Props = {
  searchParams: {
    page: string;
  };
};

const MAX_ORDERS_PER_PAGE = 5;

export default async function OrdersPage({ searchParams: { page } }: Props) {
  if (isNaN(Number(page))) redirect('/orders?page=1');

  const pageNumber = Number(page);
  const result = await fetchOrdersForUser({ pageNumber, ordersPerPage: MAX_ORDERS_PER_PAGE });

  return (
    <>
      <PageHeaderWithBorder label="Orders" />
      {result.orders ? (
        <OrdersPageStorefront
          orders={result.orders}
          pageNumber={pageNumber}
          maxOrdersPerPage={MAX_ORDERS_PER_PAGE}
          totalRowCount={result.totalRowCount}
        />
      ) : null}
    </>
  );
}
