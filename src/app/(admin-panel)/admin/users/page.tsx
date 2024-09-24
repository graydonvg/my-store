import UsersPageAdminPanelClient from '@/components/adminPanel/users/UsersPageAdminPanelClient';
import { CONSTANTS } from '@/constants';
import fetchUsers from '@/services/db/queries/fetchUsers';
import { getDataGridQueryDataFromSearchParams } from '@/utils/getDataFromSearchParams';
import { validateSearchParamsForDataGridQuery } from '@/utils/queryBuilder/validateQuery';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminPanelUsersPage({ searchParams }: Props) {
  const { page, sort, filter } = getDataGridQueryDataFromSearchParams(searchParams);

  const {
    success: validationSuccess,
    message: validationMessage,
    data: validatedSearchParams,
  } = validateSearchParamsForDataGridQuery('users', page, sort, filter);

  if (!validationSuccess || !validatedSearchParams) {
    return (
      <UsersPageAdminPanelClient
        users={null}
        totalRowCount={0}
        querySuccess={validationSuccess}
        queryMessage={validationMessage}
        page={CONSTANTS.DATA_GRID_DEFAULTS.page}
        sort={CONSTANTS.DATA_GRID_DEFAULTS.sort}
        filter={CONSTANTS.DATA_GRID_DEFAULTS.filter}
      />
    );
  }

  const { page: validatedPage, sort: validatedSort, filter: validatedFilter } = validatedSearchParams;

  const {
    success: getUsersSuccess,
    message: getUsersMessage,
    data: usersData,
  } = await fetchUsers(validatedPage, validatedSort, validatedFilter);

  if (!getUsersSuccess) {
    return (
      <UsersPageAdminPanelClient
        users={null}
        totalRowCount={0}
        querySuccess={getUsersSuccess}
        queryMessage={getUsersMessage}
        page={validatedPage}
        sort={validatedSort}
        filter={validatedFilter}
      />
    );
  }

  return (
    <UsersPageAdminPanelClient
      users={usersData.users}
      totalRowCount={usersData.totalRowCount}
      querySuccess={validationSuccess}
      queryMessage={validationMessage}
      page={validatedPage}
      sort={validatedSort}
      filter={validatedFilter}
    />
  );
}
