import getServiceSupabase from '@/lib/supabase/getServiceSupabase';
import { UsersSortByOptions } from '@/types';
import { getUsersSortOptions } from '@/utils/getTableSortOptions';

export default async function getUsersForAdmin(
  start: number,
  end: number,
  sortBy: UsersSortByOptions,
  sortDirection: 'asc' | 'desc'
) {
  const supabase = getServiceSupabase();
  const { sortUsersBy, sortOptions } = getUsersSortOptions(sortBy, sortDirection);

  let usersQuery = supabase.from('users').select('*, admin: admins(userId, createdAt)', {
    count: 'exact',
  });

  if (sortUsersBy === 'lastName') {
    usersQuery = usersQuery.order(sortUsersBy, sortOptions).order('firstName', sortOptions);
  } else {
    usersQuery = usersQuery.order(sortUsersBy, { ...sortOptions, nullsFirst: false });
  }

  const { data: users, count } = await usersQuery.range(start, end);

  console.log(users);

  const totalRowCount = count ?? 0;

  return { users, totalRowCount };
}
