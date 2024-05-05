import AdminUsersPageClient from '@/components/adminView/AdminUsersPageClient';
import getUsersForAdmin from '@/lib/db/queries/getUsers';
import {
  DataGridFilter,
  DataGridSort,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
} from '@/types';
import { getTableQueryDataFromSearchParams } from '@/utils/getTableQueryData';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page, range, sort, filter } = getTableQueryDataFromSearchParams(searchParams);

  const typedFilter = filter as DataGridFilter<AdminUsersDataGridFilterableColumns>;
  const typedSort = sort as DataGridSort<AdminUsersDataGridSortableColumns>;

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
