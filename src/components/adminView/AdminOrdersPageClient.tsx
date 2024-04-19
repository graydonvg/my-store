'use client';

import { Paper, TablePagination, lighten } from '@mui/material';
import OrdersTable from './OrdersTable';
import { AdminOrderType } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, MouseEvent, useMemo } from 'react';
import { BORDER_RADIUS } from '@/config';

type Props = {
  orders: AdminOrderType[] | null;
  isEndOfData: boolean;
  lastPage: number;
  totalRowCount: number;
};

export default function AdminOrdersPageClient({ orders, isEndOfData, lastPage, totalRowCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const pathname = usePathname();
  const page = searchParams.get('page') ?? '1';
  const rowsPerPage = searchParams.get('per_page') ?? '5';
  const currentPage = Number(page) - 1;

  function handleChangePage(_event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null, newPage: number) {
    currentSearchParams.set('page', `${newPage + 1}`);

    const updatedSearchParams = currentSearchParams.toString();

    router.push(pathname + '?' + updatedSearchParams);
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const queryStart = currentPage * newRowsPerPage;

    // Check if the newRowsPerPage will result in an empty page
    if (queryStart >= totalRowCount) {
      const maxValidPage = Math.ceil(totalRowCount / newRowsPerPage);

      currentSearchParams.set('page', `${maxValidPage}`);
    }

    currentSearchParams.set('per_page', `${newRowsPerPage}`);

    router.push(pathname + '?' + currentSearchParams.toString());
  }

  function handleGoToLastPage() {
    currentSearchParams.set('page', `${lastPage}`);

    const updatedSearchParams = currentSearchParams.toString();

    router.push(pathname + '?' + updatedSearchParams);
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: { xs: 0, sm: BORDER_RADIUS },
        overflow: 'hidden',
      }}>
      <OrdersTable orders={orders} />
      <TablePagination
        component="div"
        count={totalRowCount}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        page={currentPage}
        rowsPerPage={Number(rowsPerPage)}
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
                    backgroundColor: (theme) => theme.palette.custom.primary.light,
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
