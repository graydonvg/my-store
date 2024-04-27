import getServiceSupabase from '@/lib/supabase/getServiceSupabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

import { CustomResponseType, TableQueryData, UsersFilterableColumns, UsersSortableColumns } from '@/types';
import { applyFilterForUsersTable } from '@/utils/applyQueryFilter';
import { applySortForUsersTable } from '@/utils/applyQuerySort';
import { validatePage } from '@/utils/validateTableQueryData';
import { Database } from '@/lib/supabase/database.types';

type ResponseData = PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>;

export default async function buildUsersQueryForAdmin({
  page,
  sort,
  filter,
}: TableQueryData<UsersFilterableColumns, UsersSortableColumns>): Promise<CustomResponseType<ResponseData>> {
  const supabase = getServiceSupabase();
  const pageValidation = validatePage(page);
  let isFilterColumnInvalid = false;
  let isFilterOperatorInvalid = false;
  let isSortColumnInvalid = false;
  let isSortDirectionInvalid = false;

  let usersQuery = supabase.from('users').select('*', {
    count: 'exact',
  });

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

  if (pageValidation.success === false) {
    return {
      success: pageValidation.success,
      message: pageValidation.message,
      data: usersQuery,
    };
  } else if (isSortColumnInvalid) {
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
