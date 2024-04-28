import AdminUsersPageClient from '@/components/adminView/AdminUsersPageClient';
import getUsersForAdmin from '@/lib/db/queries/getUsers';
import { TableFilter, TableSort, UsersFilterableColumns, UsersSortableColumns } from '@/types';
import { getTableQueryDataFromSearchParams } from '@/utils/getTableQueryData';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page, range, sort, filter } = getTableQueryDataFromSearchParams(searchParams);

  const typedFilter = filter as TableFilter<UsersFilterableColumns>;
  const typedSort = sort as TableSort<UsersSortableColumns>;

  const { success, message, data } = await getUsersForAdmin({
    range,
    sort: typedSort,
    filter: typedFilter,
  });

  return (
    <AdminUsersPageClient
      users={data!.users}
      querySuccess={success}
      queryMessage={message}
      page={page}
      range={range}
      sort={typedSort}
      filter={typedFilter}
      totalRowCount={data!.totalRowCount}
    />
  );
}
