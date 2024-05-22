import { Product, QueryPageDataGrid } from '@/types';

export function calculateDiscountedProductPrice(product: Product) {
  return product?.price - product?.price * (product?.salePercentage / 100);
}

export function calculateDiscountedCartItemPrice(price: number, percentage: number) {
  return price - price * (percentage / 100);
}

export function calculateTablePagination(items: {}[] | null, page: QueryPageDataGrid, totalRowCount: number) {
  const queryStart = (page.number - 1) * page.rows;
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.ceil(totalRowCount / page.rows) > 0 ? Math.ceil(totalRowCount / page.rows) : 1;

  return { isEndOfData, lastPageNumber };
}
