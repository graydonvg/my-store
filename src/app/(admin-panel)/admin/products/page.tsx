import ProductsPageAdminPanelClient from '@/components/adminPanel/products/ProductsPageAdminPanelClient';
import { getDataGridQueryDataFromSearchParams } from '@/utils/dataGridHelpers';
import { validateSearchParamsForDataGridQuery } from '@/utils/dataGridQueryBuilder/validateQuery';
import { DATA_GRID_DEFAULTS } from '@/constants';
import { fetchProductsForAdmin } from '@/services/db/queries/fetchProductsFormAdmin';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminPanelProductsPage({ searchParams }: Props) {
  const { page, sort, filter } = getDataGridQueryDataFromSearchParams(searchParams);

  const {
    success: validationSuccess,
    message: validationMessage,
    data: validatedSearchParams,
  } = validateSearchParamsForDataGridQuery('products', page, sort, filter);

  if (!validationSuccess || !validatedSearchParams) {
    return (
      <ProductsPageAdminPanelClient
        products={null}
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
    data: productsData,
  } = await fetchProductsForAdmin(validatedPage, validatedSort, validatedFilter);

  if (!getOrdersSuccess) {
    return (
      <ProductsPageAdminPanelClient
        products={null}
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
    <ProductsPageAdminPanelClient
      products={productsData.products}
      totalRowCount={productsData.totalRowCount}
      querySuccess={validationSuccess}
      queryMessage={validationMessage}
      page={validatedPage}
      sort={validatedSort}
      filter={validatedFilter}
    />
  );
}
