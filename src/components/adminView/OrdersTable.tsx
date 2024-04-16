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
  useTheme,
} from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import MuiLink from '../ui/MuiLink';
import { AdminOrderType } from '@/types';
import { visuallyHidden } from '@mui/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
    id: 'payment_method',
    label: 'Payment Method',
  },
  {
    id: 'sale_amount',
    label: 'Sale Amount',
  },
];

type Props = {
  orders: AdminOrderType[] | null;
};

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const theme = useTheme();
  const currentSearchParams = new URLSearchParams(searchParams.toString());
  const sortBy = searchParams.get('sort_by') ?? 'date';
  const sortDirection = (searchParams.get('sort') as SortDirection | undefined) ?? 'desc';

  function handleSort(cellId: string) {
    if (cellId === sortBy) {
      const newSortDirection = sortDirection && sortDirection === 'asc' ? 'desc' : 'asc';

      currentSearchParams.set('sort', `${newSortDirection}`);
    } else {
      currentSearchParams.set('sort_by', `${cellId}`);
      currentSearchParams.set('sort', 'desc');
    }

    const updatedSearchParams = currentSearchParams.toString();

    router.push(pathname + '?' + updatedSearchParams, { scroll: false });
  }

  return (
    <TableContainer>
      <Table size={theme.breakpoints.down('sm') ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'transparent' }}>ID</TableCell>
            {sortableHeadCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={sortBy === headCell.id ? sortDirection : false}
                sx={{ backgroundColor: 'transparent' }}>
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
              <TableCell>Stripe</TableCell>
              <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
