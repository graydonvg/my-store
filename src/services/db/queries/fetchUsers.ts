import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterBuilder, QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/dataGridQueryBuilder/buildQuery';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchUsers(
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchUsers' });
  logger.info('Attempting to fetch users for admin');

  try {
    let usersQuery: QueryFilterBuilder;

    const checkIsNone = filter.operator === 'is' && filter.value === 'none';
    const checkNotNone = filter.operator === 'not' && filter.value !== 'none';

    if (filter.column === 'role' && !checkIsNone && !checkNotNone) {
      // Operator/value pairs other than 'is none' or 'not is none' require inner join to filter role
      usersQuery = supabase.from('users').select('*, ...userRoles!inner(role)', {
        count: 'exact',
      });
    } else {
      usersQuery = supabase.from('users').select('*, ...userRoles(role)', {
        count: 'exact',
      });
    }

    const builtUsersQuery = buildQuery('users', usersQuery, page, sort, filter);

    const { data: users, count, error } = await builtUsersQuery;

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return {
        success: false,
        message: error.message,
        data: { users: null, totalRowCount: count ?? 0 },
      };
    }

    logger.info('Fetched users for admin successfully');

    return {
      success: true,
      message: 'Success!',
      data: { users, totalRowCount: count ?? 0 },
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: { users: null, totalRowCount: 0 },
    };
  } finally {
    await logger.flush();
  }
}
