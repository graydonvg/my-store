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
import { OrdersDataGrid } from '@/types';
import dayjs from 'dayjs';
import Link from 'next/link';
import MuiLink from '../../ui/MuiLink';
import CardTitle from './CardTitle';
import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';
import { ArrowForward } from '@mui/icons-material';

const headCellLabels = ['ID', 'Date', 'Name', 'Ship To', 'Status', 'Order Total'];

type Props = {
  orders: OrdersDataGrid[] | null;
};

export default function RecentOrdersTable({ orders }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardTitle>Recent Orders</CardTitle>
        <Link href="/admin/orders">
          <MuiLink>
            View All
            <ArrowForward
              fontSize="small"
              sx={{ marginLeft: 1 }}
            />
          </MuiLink>
        </Link>
      </Box>
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
            {orders
              ? orders.map((order) => (
                  <TableRow key={order?.orderId}>
                    <TableCell>{order?.orderId}</TableCell>
                    <TableCell>{dayjs(order?.createdAt).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                    <TableCell>{`${order?.city}, ${order?.province}`}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        {!orders ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: 2 }}>
            <CustomNoRowsOverlay text="No data received" />
          </Box>
        ) : null}
      </TableContainer>
    </>
  );
}
