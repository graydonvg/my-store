import { OrdersSortByOptions } from '@/types';

type SearchParams = { [key: string]: string | string[] | undefined };

export function getOrdersQueryDataForAdmin(searchParams: SearchParams) {
  const page = (searchParams['page'] ?? '1') as string;
  const pageNumber = Number(page);

  const rowsPerPage = (searchParams['per_page'] ?? '5') as string;
  const rowsPerPageNumber = Number(rowsPerPage);

  const sortBy = (searchParams['sort_by'] ?? 'date') as OrdersSortByOptions;
  const sortDirection = (searchParams['sort'] ?? 'desc') as 'asc' | 'desc';

  const queryStart = (pageNumber - 1) * rowsPerPageNumber;
  const queryEnd = queryStart + (rowsPerPageNumber - 1);

  return { queryStart, queryEnd, sortBy, sortDirection, page: pageNumber, rowsPerPage: rowsPerPageNumber };
}

export function getTableQueryDataFromSearchParams(searchParams: SearchParams) {
  const pageString = (searchParams['page'] ?? '1') as string;
  const pageNumber = Number(pageString);

  const rowsPerPage = (searchParams['per_page'] ?? '5') as string;
  const rowsPerPageNumber = Number(rowsPerPage);

  const rangeStart = (pageNumber - 1) * rowsPerPageNumber;
  const rangeEnd = rangeStart + (rowsPerPageNumber - 1);

  const sortBy = (searchParams['sort_by'] ?? 'createdAt') as string;
  const sortDirection = (searchParams['sort'] ?? 'desc') as 'asc' | 'desc';

  const filterColumn = (searchParams['col'] ?? null) as string | null;
  const filterOperator = (searchParams['op'] ?? null) as string | null;
  const decodedOperator = filterOperator ? (decodeURIComponent(filterOperator) as string) : null;
  const filterValue = (searchParams['val'] ?? null) as string | null;

  const page = { number: pageNumber, rows: rowsPerPageNumber };
  const range = { start: rangeStart, end: rangeEnd };
  const sort = { by: sortBy, direction: sortDirection };
  const filter = { column: filterColumn, operator: decodedOperator, value: filterValue };

  return { page, range, sort, filter };
}
