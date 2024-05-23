'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatCurrency } from '@/utils/format';
import { OrdersDataGridDataAdmin } from '@/types';
import dayjs from 'dayjs';
import Link from 'next/link';
import MuiLink from '../../ui/MuiLink';
import CardTitle from './CardTitle';

const headCellLabels = ['ID', 'Date', 'Name', 'Ship To', 'Status', 'Order Total'];

type Props = {
  orders: OrdersDataGridDataAdmin[] | null;
};

export default function RecentOrdersTable({ orders }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <CardTitle>Recent Orders</CardTitle>
      <TableContainer>
        <Table
          size={isBelowSmall ? 'small' : 'medium'}
          stickyHeader>
          <TableHead>
            <TableRow>
              {headCellLabels.map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    backgroundColor: theme.palette.custom.dataGrid.header,
                  }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order?.orderId}>
                <TableCell>{order?.orderId}</TableCell>
                <TableCell>{dayjs(order?.createdAt).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                <TableCell>{`${order?.city}, ${order?.province}`}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ width: 'fit-content', marginTop: 2 }}>
        <Link href="/admin/orders">
          <MuiLink>See more orders</MuiLink>
        </Link>
      </Box>
    </>
  );
}
