import { QuerySortDataGrid, QueryFilterBuilder } from '@/types';

type SortFunctionParams = {
  query: QueryFilterBuilder;
  sort: QuerySortDataGrid;
};

function applySort({ query, sort }: SortFunctionParams) {
  let sortColumn = sort.column === 'role' ? 'userRoles(role)' : sort.column;

  if (sort.direction === 'asc') {
    return query.order(sortColumn, { ascending: true });
  } else if (sort.direction === 'desc') {
    return query.order(sortColumn, { ascending: false });
  } else {
    return query;
  }
}

export function applyQuerySort(query: QueryFilterBuilder, sort: QuerySortDataGrid) {
  switch (sort.column) {
    case 'createdAt':
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'contactNumber':
    case 'role':
      return applySort({ query, sort });
    default:
      return query;
  }
}
