import UsersPageAdminPanelClient from '@/components/adminPanel/UsersPageAdminPanelClient';
import { DATA_GRID_DEFAULTS } from '@/data';
import { getUsersForAdmin } from '@/lib/db/queries/getUsers';
import { getDataGridQueryDataFromSearchParams } from '@/utils/getDataFromSearchParams';
import { validateSearchParamsForDataGridQuery } from '@/utils/validate';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function UsersPageAdminPanel({ searchParams }: Props) {
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
        page={DATA_GRID_DEFAULTS.page}
        sort={DATA_GRID_DEFAULTS.sort}
        filter={DATA_GRID_DEFAULTS.filter}
      />
    );
  }

  const { page: validatedPage, sort: validatedSort, filter: validatedFilter } = validatedSearchParams;

  const {
    success: getUsersSuccess,
    message: getUsersMessage,
    data: usersData,
  } = await getUsersForAdmin(validatedPage, validatedSort, validatedFilter);

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
