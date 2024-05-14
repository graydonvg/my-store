import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterBuilder, QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/queryBuilder/buildQuery';

export async function getUsersForAdmin(page: QueryPageDataGrid, sort: QuerySortDataGrid, filter: QueryFilterDataGrid) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let usersQuery: QueryFilterBuilder;

  const checkIsNone = filter.operator === 'is' && filter.value === 'none';
  const checkNotNone = filter.operator === 'not' && filter.value !== 'none';

  if (filter.column === 'role' && !checkIsNone && !checkNotNone) {
    // Operator/value pairs other than 'is none' or 'not is none' require inner join to filter role
    usersQuery = supabase
      .from('users')
      .select('*, ...userRoles!inner(role)', {
        count: 'exact',
      })
      .neq('userId', authUser?.id);
  } else {
    usersQuery = supabase
      .from('users')
      .select('*, ...userRoles(role)', {
        count: 'exact',
      })
      .neq('userId', authUser?.id);
  }

  const builtUsersQuery = buildQuery(usersQuery, page, sort, filter);

  const { data: users, count, error } = await builtUsersQuery;

  if (error) {
    return {
      success: false,
      message: error.message,
      data: { users: null, totalRowCount: count ?? 0 },
    };
  }

  return {
    success: true,
    message: 'Success!',
    data: { users, totalRowCount: count ?? 0 },
  };
}
