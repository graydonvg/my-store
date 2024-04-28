import getServiceSupabase from '@/lib/supabase/getServiceSupabase';

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
  page,
  sort,
  filter,
  range,
}: TableQueryData<UsersFilterableColumns, UsersSortableColumns>): Promise<CustomResponseType<ResponseData>> {
  const supabase = getServiceSupabase();
  let usersQuery = supabase.from('users').select('*', {
    count: 'exact',
  });

  const {
    success,
    message,
    data: builtUsersQuery,
  } = await buildUsersQueryForAdmin({ usersQuery, page, sort, filter, range });

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
