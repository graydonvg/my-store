import {
  QueryPageDataGrid,
  QuerySortDataGrid,
  QueryFilterDataGrid,
  QueryFilterBuilder,
  DataGridOptions,
} from '@/types';
import { applyQueryRangeForDataGrid } from './applyQueryRange';
import { applyQueryFilter } from './applyQueryFilter';
import { applyQuerySort } from './applyQuerySort';

export default function buildQuery(
  dataGrid: DataGridOptions,
  query: QueryFilterBuilder,
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
): QueryFilterBuilder {
  if (filter.column && filter.operator) {
    query = applyQueryFilter(query, filter);
  }

  query = applyQuerySort(dataGrid, query, sort);

  query = applyQueryRangeForDataGrid(query, page);

  return query;
}
