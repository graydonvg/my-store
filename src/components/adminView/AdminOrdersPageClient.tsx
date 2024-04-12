'use client';

import { LabelDisplayedRowsArgs, Pagination, TablePagination, useMediaQuery, useTheme } from '@mui/material';
import OrdersTable from './OrdersTable';
import { AdminOrderType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, MouseEvent } from 'react';

type Props = {
  orders: AdminOrderType[] | null;
};

export default function AdminOrdersPageClient({ orders }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? 1;
  const rowsPerPage = searchParams.get('per_page') ?? 5;

  function handleChangePage(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null, newPage: number) {
    router.push(`/admin/orders?page=${newPage + 1}&per_page=${rowsPerPage}`);
    router.refresh();
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    router.push(`/admin/orders?page=${page}&per_page=${parseInt(event.target.value, 10)}`);
    router.refresh();
  }

  function defaultLabelDisplayedRows({ from, to, count }: LabelDisplayedRowsArgs) {
    return `${from}–${to}`;
  }

  return (
    <>
      <OrdersTable
        orders={orders}
        tableSize={isBelowSmall ? 'small' : 'medium'}
      />
      <TablePagination
        component="div"
        labelDisplayedRows={defaultLabelDisplayedRows}
        count={-1}
        rowsPerPageOptions={[5, 10, 15, 20]}
        page={Number(page) - 1}
        rowsPerPage={Number(rowsPerPage)}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage={isBelowSmall ? 'Rows:' : 'Rows per page:'}
        sx={{
          '& .MuiTablePagination-input': {
            marginRight: { xs: 2, sm: 4 },
          },
        }}
      />
    </>
  );
}
