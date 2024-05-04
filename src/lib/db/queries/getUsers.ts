import createSupabaseServerClient from '@/lib/supabase/supabase-server';

import {
  CustomResponse,
  AdminUsersTableUserData,
  DataGridQueryData,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
} from '@/types';
import buildUsersQueryForAdmin from '@/utils/buildQuery';

type ResponseData = {
  users: AdminUsersTableUserData[] | null;
  totalRowCount: number;
};

export default async function getUsersForAdmin({
  sort,
  filter,
  range,
}: Omit<DataGridQueryData<AdminUsersDataGridFilterableColumns, AdminUsersDataGridSortableColumns>, 'page'>): Promise<
  CustomResponse<ResponseData>
> {
  const supabase = await createSupabaseServerClient();
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
