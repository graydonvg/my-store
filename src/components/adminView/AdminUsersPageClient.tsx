'use client';

import { Paper, TablePagination, lighten } from '@mui/material';
import { AdminUserDataType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, MouseEvent } from 'react';
import { BORDER_RADIUS } from '@/config';
import UsersTable from './UsersTable';

type Props = {
  users: AdminUserDataType[] | null;
  isEndOfData: boolean;
  page: number;
  rowsPerPage: number;
  lastPageNumber: number;
  totalRowCount: number;
};

export default function AdminUsersPageClient({
  users,
  isEndOfData,
  page,
  rowsPerPage,
  lastPageNumber,
  totalRowCount,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams.toString());
  const currentPage = page - 1;

  function handleChangePage(_event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null, newPage: number) {
    newSearchParams.set('page', `${newPage + 1}`);

    router.push(`?${newSearchParams}`);
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const queryStart = currentPage * newRowsPerPage;

    // Check if the newRowsPerPage will result in an empty page
    if (queryStart >= totalRowCount) {
      const maxValidPage = Math.ceil(totalRowCount / newRowsPerPage);

      newSearchParams.set('page', `${maxValidPage}`);
    }

    newSearchParams.set('per_page', `${newRowsPerPage}`);

    router.push(`?${newSearchParams}`);
  }

  function handleGoToLastPage() {
    newSearchParams.set('page', `${lastPageNumber}`);

    router.push(`?${newSearchParams}`);
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 0, sm: BORDER_RADIUS },
        overflow: 'hidden',
      }}>
      <UsersTable users={users} />
      <TablePagination
        component="div"
        count={totalRowCount}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Rows:"
        showFirstButton
        showLastButton
        slotProps={{
          actions: {
            nextButton: {
              disabled: isEndOfData,
            },
            lastButton: {
              disabled: isEndOfData,
              onClick: handleGoToLastPage,
            },
          },
          select: {
            MenuProps: {
              MenuListProps: {
                sx: {
                  '& .MuiTablePagination-menuItem.Mui-selected': {
                    color: (theme) => theme.palette.custom.typographyVariants.white,
                    backgroundColor: (theme) => `${theme.palette.custom.primary.light} !important`,
                    '&:hover': {
                      backgroundColor: (theme) => lighten(theme.palette.custom.primary.light, 0.1),
                    },
                  },
                },
              },
            },
          },
        }}
        sx={(theme) => ({
          backgroundColor: theme.palette.custom.table.footer,
          '& .MuiTablePagination-toolbar': {
            paddingX: 2,
            paddingY: 1,
            minHeight: 0,
          },
          '& .MuiTablePagination-input': {
            marginRight: { xs: 2, sm: 4 },
          },
        })}
      />
    </Paper>
  );
}
