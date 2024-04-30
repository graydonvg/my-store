import createSupabaseService from '@/lib/supabase/supabase-service';

import {
  CustomResponseType,
  AdminUserDataType,
  TableQueryData,
  UsersFilterableColumns,
  UsersSortableColumns,
} from '@/types';
import buildUsersQueryForAdmin from '@/utils/buildQuery';

type ResponseData = {
  users: AdminUserDataType[] | null;
  totalRowCount: number;
};

export default async function getUsersForAdmin({
  sort,
  filter,
  range,
}: Omit<TableQueryData<UsersFilterableColumns, UsersSortableColumns>, 'page'>): Promise<
  CustomResponseType<ResponseData>
> {
  const supabase = createSupabaseService();
  let usersQuery = supabase.from('users').select('*', {
    count: 'exact',
  });

  const { success, message, data: builtUsersQuery } = await buildUsersQueryForAdmin({ usersQuery, sort, filter });

  if (success === true) {
    const { data: users, count } = await builtUsersQuery!.range(range.start, range.end);

    return {
      success,
      message,
      data: { users, totalRowCount: count ?? 0 },
    };
  } else {
    return {
      success,
      message,
      data: { users: null, totalRowCount: 0 },
    };
  }
}
