'use client';

import {
  Box,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import MuiLink from '../ui/MuiLink';
import { AdminOrderType } from '@/types';
import { visuallyHidden } from '@mui/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const sortableHeadCells = [
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'ship_to',
    label: 'Ship To',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'order_total',
    label: 'Order Total',
  },
];

type Props = {
  orders: AdminOrderType[] | null;
};

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const newSearchParams = new URLSearchParams(searchParams.toString());
  const sortBy = searchParams.get('sort_by') ?? 'date';
  const sortDirection = (searchParams.get('sort') as SortDirection | undefined) ?? 'desc';

  function handleSort(cellId: string) {
    if (cellId === sortBy) {
      const newSortDirection = sortDirection && sortDirection === 'asc' ? 'desc' : 'asc';

      newSearchParams.set('sort', `${newSortDirection}`);
    } else {
      newSearchParams.set('sort_by', `${cellId}`);
      newSearchParams.set('sort', 'desc');
    }

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  return (
    <TableContainer
      sx={{ maxHeight: { xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 152px)', md: 'calc(100vh - 168px)' } }}>
      <Table
        size={isBelowSmall ? 'small' : 'medium'}
        stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: theme.palette.custom.table.header,
              }}>
              ID
            </TableCell>
            {sortableHeadCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={sortBy === headCell.id ? sortDirection : false}
                sx={{
                  backgroundColor: theme.palette.custom.table.header,
                }}>
                <TableSortLabel
                  active={sortBy === headCell.id}
                  direction={sortBy === headCell.id && sortDirection ? sortDirection : 'desc'}
                  onClick={() => handleSort(headCell.id)}>
                  {headCell.label}
                  {sortBy === headCell.id ? (
                    <Box
                      component="span"
                      sx={visuallyHidden}>
                      {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order?.orderId}>
              <TableCell>
                <MuiLink>{order?.orderId}</MuiLink>
              </TableCell>
              <TableCell>{order?.createdAt.split('T')[0]}</TableCell>
              <TableCell>{`${order.user?.firstName} ${order.user?.lastName}`}</TableCell>
              <TableCell>{`${order?.shippingDetails[0].city}, ${order?.shippingDetails[0].province}`}</TableCell>
              <TableCell>{order.isPaid ? 'Paid' : 'Not paid'}</TableCell>
              <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
