import { QueryPageDataGrid } from '@/types';

export function calculateRoundedDiscountedPrice(price: number, percentage: number) {
  const discountedPrice = price - price * (percentage / 100);
  const roundedDiscountedPrice = Math.round(discountedPrice);

  return roundedDiscountedPrice;
}

export function calculateTablePagination(items: {}[] | null, page: QueryPageDataGrid, totalRowCount: number) {
  const queryStart = (page.number - 1) * page.rows;
  const itemsLength = items?.length ?? 0;
  const isEndOfData = queryStart + itemsLength >= totalRowCount;
  const lastPageNumber = Math.ceil(totalRowCount / page.rows) > 0 ? Math.ceil(totalRowCount / page.rows) : 1;

  return { isEndOfData, lastPageNumber };
}
