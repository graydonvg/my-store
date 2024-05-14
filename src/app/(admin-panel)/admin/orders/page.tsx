import OrdersPageAdminPanelClient from '@/components/adminPanel/OrdersPageAdminPanelClient';
import { DATA_GRID_DEFAULTS } from '@/data';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { getDataGridQueryDataFromSearchParams } from '@/utils/getDataFromSearchParams';
import { validateSearchParamsForDataGridQuery } from '@/utils/validate';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function OrdersPageAdminPanel({ searchParams }: Props) {
  const { page, sort, filter } = getDataGridQueryDataFromSearchParams(searchParams);

  const {
    success: validationSuccess,
    message: validationMessage,
    data: validatedSearchParams,
  } = validateSearchParamsForDataGridQuery('orders', page, sort, filter);

  if (!validationSuccess || !validatedSearchParams) {
    return (
      <OrdersPageAdminPanelClient
        orders={null}
        totalRowCount={0}
        querySuccess={validationSuccess}
        queryMessage={validationMessage}
        page={DATA_GRID_DEFAULTS.page}
        sort={DATA_GRID_DEFAULTS.sort}
        filter={DATA_GRID_DEFAULTS.filter}
      />
    );
  }

  const { page: validatedPage, sort: validatedSort, filter: validatedFilter } = validatedSearchParams;

  const {
    success: getOrdersSuccess,
    message: getOrdersMessage,
    data: ordersData,
  } = await getOrdersForAdmin(validatedPage, validatedSort, validatedFilter);

  if (!getOrdersSuccess) {
    return (
      <OrdersPageAdminPanelClient
        orders={null}
        totalRowCount={0}
        querySuccess={getOrdersSuccess}
        queryMessage={getOrdersMessage}
        page={validatedPage}
        sort={validatedSort}
        filter={validatedFilter}
      />
    );
  }

  return (
    <OrdersPageAdminPanelClient
      orders={ordersData.orders}
      totalRowCount={ordersData.totalRowCount}
      querySuccess={validationSuccess}
      queryMessage={validationMessage}
      page={validatedPage}
      sort={validatedSort}
      filter={validatedFilter}
    />
  );
}