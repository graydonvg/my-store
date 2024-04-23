import AdminUsersPageClient from '@/components/adminView/AdminUsersPageClient';
import getUsersForAdmin from '@/lib/db/queries/getUsers';
import calculateTablePagination from '@/utils/calculateTablePagination';
import { getUsersQueryDataForAdmin } from '@/utils/getQueryData';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page, rowsPerPage, queryStart, queryEnd, sortBy, sortDirection } = getUsersQueryDataForAdmin(searchParams);

  const { users, totalRowCount } = await getUsersForAdmin(queryStart, queryEnd, sortBy, sortDirection);

  const { isEndOfData, lastPageNumber } = calculateTablePagination(users, queryStart, rowsPerPage, totalRowCount);

  return (
    <AdminUsersPageClient
      page={page}
      rowsPerPage={rowsPerPage}
      users={users}
      isEndOfData={isEndOfData}
      lastPageNumber={lastPageNumber}
      totalRowCount={totalRowCount}
    />
  );
}
