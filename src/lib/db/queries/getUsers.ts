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
  const {
    success: buildUsersQuerySuccess,
    message: buildUsersQueryMessage,
    data: builtUsersQuery,
  } = await buildUsersQueryForAdmin({ sort, filter });

  if (buildUsersQuerySuccess === true) {
    const { data: users, count, error: finalQueryError } = await builtUsersQuery!.range(range.start, range.end);

    if (!finalQueryError) {
      return {
        success: true,
        message: 'Success!',
        data: { users, totalRowCount: count ?? 0 },
      };
    } else {
      // Axiom error log
      // Need log here for full db error
      return {
        success: false,
        message: finalQueryError.message,
        data: { users: null, totalRowCount: 0 },
      };
    }
  } else {
    // Axiom error log
    return {
      success: false,
      message: buildUsersQueryMessage,
      data: { users: null, totalRowCount: 0 },
    };
  }
}
