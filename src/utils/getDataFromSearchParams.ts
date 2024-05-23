import { constants } from '@/constants';

type SearchParams = { [key: string]: string | string[] | undefined };

export function getDataGridQueryDataFromSearchParams(searchParams: SearchParams) {
  const { page: pageDefault, sort: sortDefalut, filter: filterDefault } = constants.dataGridDefaults;

  const pageString = (searchParams['page'] ?? `${pageDefault.number}`) as string;
  const pageNumber = Number(pageString);

  const rowsPerPage = (searchParams['per_page'] ?? `${pageDefault.rows}`) as string;
  const rowsPerPageNumber = Number(rowsPerPage);

  const sortColumn = (searchParams['sort_by'] ?? sortDefalut.column) as string;
  const sortDirection = (searchParams['sort'] ?? sortDefalut.direction) as 'asc' | 'desc';

  const filterColumn = (searchParams['col'] ?? filterDefault.column) as string | null;
  const filterOperator = (searchParams['op'] ?? filterDefault.operator) as string | null;
  const decodedOperator = filterOperator ? (decodeURIComponent(filterOperator) as string) : null;
  const filterValue = (searchParams['val'] ?? filterDefault.value) as string | null;

  const page = { number: pageNumber, rows: rowsPerPageNumber };
  const sort = { column: sortColumn, direction: sortDirection };
  const filter = { column: filterColumn, operator: decodedOperator, value: filterValue };

  return { page, sort, filter };
}
