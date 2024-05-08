import {
  QueryFilterBuilder,
  DataGridSort,
  AdminUsersDataGridQueryFilterBuilder,
  AdminUsersDataGridSortableColumns,
  DataGridInvalidFlags,
} from '@/types';

type SortFunctionParams = {
  query: QueryFilterBuilder;
  sort: DataGridSort<AdminUsersDataGridSortableColumns>;
  setInvalidFlags: (options: DataGridInvalidFlags) => void;
};

function applySort({ query, sort, setInvalidFlags }: SortFunctionParams) {
  let sortBy = sort.by === 'role' ? 'userRoles(role)' : sort.by;

  if (sort.direction === 'asc') {
    return query.order(sortBy, { ascending: true });
  } else if (sort.direction === 'desc') {
    return query.order(sortBy, { ascending: false });
  } else {
    setInvalidFlags({ sortDirection: true });
    return query;
  }
}

export function applySortForUsersTable(
  usersQuery: AdminUsersDataGridQueryFilterBuilder,
  sort: DataGridSort<AdminUsersDataGridSortableColumns>,
  setInvalidFlags: (options: DataGridInvalidFlags) => void
) {
  switch (sort.by) {
    case 'createdAt':
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'contactNumber':
    case 'role':
      return applySort({ query: usersQuery, sort, setInvalidFlags });
    default:
      setInvalidFlags({ sortColumn: true });
      return usersQuery;
  }
}
