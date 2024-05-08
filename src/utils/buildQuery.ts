import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import {
  CustomResponse,
  QueryFilterBuilder,
  DataGridQueryData,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridQueryFilterBuilderResponse,
  AdminUsersDataGridSortableColumns,
  DataGridInvalidFlags,
} from '@/types';
import { applyFilterForUsersTable } from '@/utils/applyQueryFilter';
import { applySortForUsersTable } from '@/utils/applyQuerySort';

type BuildUsersQueryParams = {
  sort: DataGridQueryData<AdminUsersDataGridFilterableColumns, AdminUsersDataGridSortableColumns>['sort'];
  filter: DataGridQueryData<AdminUsersDataGridFilterableColumns, AdminUsersDataGridSortableColumns>['filter'];
};

export default async function buildUsersQueryForAdmin({
  sort,
  filter,
}: BuildUsersQueryParams): Promise<CustomResponse<AdminUsersDataGridQueryFilterBuilderResponse>> {
  const supabase = await createSupabaseServerClient();

  let isFilterColumnInvalid = false;
  let isFilterOperatorInvalid = false;
  let isSortColumnInvalid = false;
  let isSortDirectionInvalid = false;

  let usersQuery: QueryFilterBuilder;

  if (filter.column === 'role' && !(filter.operator === 'is' && filter.value === 'null')) {
    // Operator/value pairs other than is null require inner join to filter role
    usersQuery = supabase.from('users').select('*, ...userRoles!inner(role)', {
      count: 'exact',
    });
  } else {
    usersQuery = supabase.from('users').select('*, ...userRoles(role)', {
      count: 'exact',
    });
  }

  function setInvalidFlags(options: DataGridInvalidFlags) {
    const { filterColumn, filterOperator, sortColumn, sortDirection } = options;

    if (filterColumn) {
      isFilterColumnInvalid = true;
    }

    if (filterOperator) {
      isFilterOperatorInvalid = true;
    }

    if (sortColumn) {
      isSortColumnInvalid = true;
    }

    if (sortDirection) {
      isSortDirectionInvalid = true;
    }
  }

  if (filter.column && filter.operator) {
    usersQuery = applyFilterForUsersTable(usersQuery, filter, setInvalidFlags);
  }

  if (sort.by && sort.direction) {
    usersQuery = applySortForUsersTable(usersQuery, sort, setInvalidFlags);
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
      message: 'Success! No validation errors caught.',
      data: usersQuery,
    };
  }
}
