import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { TableSort, UsersSortableColumns } from '@/types';
import { validateSortColumn, validateSortDirection } from './validateTableQueryData';
import { Database } from '@/lib/supabase/database.types';

export function applySortForUsersTable(
  usersQuery: PostgrestFilterBuilder<Database['public'], any, any[], string, any[]>,
  sort: TableSort<UsersSortableColumns>,
  setSortColumnInvalid: () => void,
  setSortDirectionInvalid: () => void
) {
  validateSortColumn(sort.by, setSortColumnInvalid);
  validateSortDirection(sort.direction, setSortDirectionInvalid);

  return usersQuery.order(sort.by, { ascending: sort.direction === 'asc' ? true : false });
}
