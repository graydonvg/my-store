import { CONSTANTS } from '@/constants';
import { GridValidRowModel } from '@mui/x-data-grid';

export function getChangedDataGridValue(newObj: GridValidRowModel, oldObj: GridValidRowModel): GridValidRowModel {
  const changedValue: GridValidRowModel = {};

  Object.keys(newObj).forEach((key) => {
    if (newObj[key] !== oldObj[key]) {
      changedValue[key] = newObj[key] === '' ? null : newObj[key];
    }
  });

  return changedValue;
}

type SearchParams = { [key: string]: string | string[] | undefined };

export function getDataGridQueryDataFromSearchParams(searchParams: SearchParams) {
  const { page: pageDefault, sort: sortDefalut, filter: filterDefault } = CONSTANTS.DATA_GRID_DEFAULTS;

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
