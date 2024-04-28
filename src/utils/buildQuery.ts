import {
  CustomResponseType,
  QueryFilterBuilder,
  TableQueryData,
  UsersFilterableColumns,
  UsersQueryFilterBuilderResponse,
  UsersSortableColumns,
} from '@/types';
import { applyFilterForUsersTable } from '@/utils/applyQueryFilter';
import { applySortForUsersTable } from '@/utils/applyQuerySort';

type BuildUsersQueryParams = {
  usersQuery: QueryFilterBuilder;
  sort: TableQueryData<UsersFilterableColumns, UsersSortableColumns>['sort'];
  filter: TableQueryData<UsersFilterableColumns, UsersSortableColumns>['filter'];
};

export default async function buildUsersQueryForAdmin({
  usersQuery,
  sort,
  filter,
}: BuildUsersQueryParams): Promise<CustomResponseType<UsersQueryFilterBuilderResponse>> {
  let isFilterColumnInvalid = false;
  let isFilterOperatorInvalid = false;
  let isSortColumnInvalid = false;
  let isSortDirectionInvalid = false;

  function setFilterColumnInvalid() {
    isFilterColumnInvalid = true;
  }

  function setFilterOperatorInvalid() {
    isFilterOperatorInvalid = true;
  }

  function setSortColumnInvalid() {
    isSortColumnInvalid = true;
  }

  function setSortDirectionInvalid() {
    isSortDirectionInvalid = true;
  }

  if (filter.column && filter.operator) {
    usersQuery = applyFilterForUsersTable(usersQuery, filter, setFilterColumnInvalid, setFilterOperatorInvalid);
  }

  if (sort.by && sort.direction) {
    usersQuery = applySortForUsersTable(usersQuery, sort, setSortColumnInvalid, setSortDirectionInvalid);
  }

  if (isSortColumnInvalid) {
    return {
      success: false,
      message: `The provided column '${sort.by}' is invalid.`,
      data: usersQuery,
    };
  } else if (isSortDirectionInvalid) {
    return {
      success: false,
      message: `The provided sorting direction '${sort.direction}' is invalid. Options are 'asc' or 'desc' only.`,
      data: usersQuery,
    };
  } else if (isFilterColumnInvalid) {
    return {
      success: false,
      message: `The provided column '${filter.column}' is invalid.`,
      data: usersQuery,
    };
  } else if (isFilterOperatorInvalid) {
    return {
      success: false,
      message: `The provided operator '${filter.operator}' is invalid.`,
      data: usersQuery,
    };
  } else {
    return {
      success: true,
      message: 'Success! No validation errors.',
      data: usersQuery,
    };
  }
}
