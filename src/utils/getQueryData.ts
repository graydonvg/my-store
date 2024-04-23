import { OrdersSortByOptions, UsersSortByOptions } from '@/types';

type SearchParams = { [key: string]: string | string[] | undefined };

export function getOrdersQueryDataForAdmin(searchParams: SearchParams) {
  const page = (searchParams['page'] ?? '1') as string;
  const pageNumber = Number(page);

  const rowsPerPage = (searchParams['per_page'] ?? '5') as string;
  const rowsPerPageNumber = Number(rowsPerPage);

  const sortBy = (searchParams['sort_by'] as OrdersSortByOptions) ?? 'date';
  const sortDirection = (searchParams['sort'] as 'asc' | 'desc') ?? 'desc';

  const queryStart = (pageNumber - 1) * rowsPerPageNumber;
  const queryEnd = queryStart + (rowsPerPageNumber - 1);

  return { queryStart, queryEnd, sortBy, sortDirection, page: pageNumber, rowsPerPage: rowsPerPageNumber };
}

export function getUsersQueryDataForAdmin(searchParams: SearchParams) {
  const page = (searchParams['page'] ?? '1') as string;
  const pageNumber = Number(page);

  const rowsPerPage = (searchParams['per_page'] ?? '5') as string;
  const rowsPerPageNumber = Number(rowsPerPage);

  const sortBy = (searchParams['sort_by'] as UsersSortByOptions) ?? 'joined';
  const sortDirection = (searchParams['sort'] as 'asc' | 'desc') ?? 'desc';

  const queryStart = (pageNumber - 1) * rowsPerPageNumber;
  const queryEnd = queryStart + (rowsPerPageNumber - 1);

  return { queryStart, queryEnd, sortBy, sortDirection, page: pageNumber, rowsPerPage: rowsPerPageNumber };
}
