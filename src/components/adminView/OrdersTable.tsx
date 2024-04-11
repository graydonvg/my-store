'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import MuiLink from '../ui/MuiLink';
import { AdminOrderType } from '@/types';

type Props = {
  tableSize: 'small' | 'medium';
  orders: AdminOrderType[] | null;
};

export default function OrdersTable({ orders, tableSize }: Props) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size={tableSize}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Sale Amount</TableCell>
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
    </Box>
  );
}
