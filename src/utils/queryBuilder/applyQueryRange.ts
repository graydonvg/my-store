import { QueryFilterBuilder, QueryPageDataGrid } from '@/types';

export function applyQueryRangeForDataGrid(query: QueryFilterBuilder, page: QueryPageDataGrid) {
  const rangeStart = (page.number - 1) * page.rows;
  const rangeEnd = rangeStart + (page.rows - 1);

  return query.range(rangeStart, rangeEnd);
}
