'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import OrdersTable from './OrdersTable';
import { AdminOrderType } from '@/types';

type Props = {
  orders: AdminOrderType[] | null;
};

export default function AdminOrdersPageClient({ orders }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <OrdersTable
      orders={orders}
      tableSize={isBelowSmall ? 'small' : 'medium'}
    />
  );
}
