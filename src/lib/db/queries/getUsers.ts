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
  const { success, message, data: usersQuery } = await buildUsersQueryForAdmin({ page, sort, filter, range });

  if (success === true) {
    const { data: users, count } = await usersQuery!.range(range.start, range.end);

    const totalRowCount = count ?? 0;

    return {
      success: true,
      message: `Success!`,
      data: { users, totalRowCount },
    };
  } else {
    return {
      success: success,
      message: message,
      data: { users: null, totalRowCount: 0 },
    };
  }
}
