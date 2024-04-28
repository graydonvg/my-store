import { QueryFilterBuilder, TableSort, UsersQueryFilterBuilder, UsersSortableColumns } from '@/types';

type SortFunctionParams = {
  query: QueryFilterBuilder;
  sort: TableSort<UsersSortableColumns>;
  setSortDirectionInvalid: () => void;
};

function applySort({ query, sort, setSortDirectionInvalid }: SortFunctionParams) {
  if (sort.direction === 'asc') {
    return query.order(sort.by, { ascending: true });
  } else if (sort.direction === 'desc') {
    return query.order(sort.by, { ascending: false });
  } else {
    setSortDirectionInvalid();
    return query;
  }
}

export function applySortForUsersTable(
  usersQuery: UsersQueryFilterBuilder,
  sort: TableSort<UsersSortableColumns>,
  setSortColumnInvalid: () => void,
  setSortDirectionInvalid: () => void
) {
  switch (sort.by) {
    case 'createdAt':
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'contactNumber':
    case 'role':
      return applySort({ query: usersQuery, sort, setSortDirectionInvalid });
    default:
      setSortColumnInvalid();
      return usersQuery;
  }
}
