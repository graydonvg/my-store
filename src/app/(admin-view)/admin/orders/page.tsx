'use client';

import OrdersTable from '@/components/adminView/OrdersTable';
import { BORDER_RADIUS } from '@/config';
import { Paper, useMediaQuery, useTheme } from '@mui/material';

function createData(id: number, date: string, name: string, shipTo: string, paymentMethod: string, amount: number) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const parts = formattedDate.split(' ');
  return `${parts[1]} ${parts[0]} ${parts[2]}`.replace(',', '');
}

const rows = [
  createData(0, getCurrentDateFormatted(), 'Sophia Smith', 'Johannesburg, GT', 'Stripe', 3496),
  createData(1, getCurrentDateFormatted(), 'Ethan Johnson', 'Cape Town, WC', 'Stripe', 2749),
  createData(2, getCurrentDateFormatted(), 'Isabella Brown', 'Durban, KZN', 'Stripe', 489),
  createData(3, getCurrentDateFormatted(), 'Liam Davis', 'Bloemfontein, FS', 'Stripe', 3199),
  createData(4, getCurrentDateFormatted(), 'Olivia Wilson', 'Port Elizabeth, EC', 'Stripe', 1580),
  createData(5, getCurrentDateFormatted(), 'Emma Jackson', 'Pretoria, GT', 'Stripe', 2200),
  createData(6, getCurrentDateFormatted(), 'James Anderson', 'Polokwane, LP', 'Stripe', 1750),
  createData(7, getCurrentDateFormatted(), 'Noah Martinez', 'East London, EC', 'Stripe', 410),
  createData(8, getCurrentDateFormatted(), 'Ava Thompson', 'Kimberley, NC', 'Stripe', 2950),
  createData(9, getCurrentDateFormatted(), 'William Garcia', 'Nelspruit, MP', 'Stripe', 3820),
  // createData(10, getCurrentDateFormatted(), 'Sophia Johnson', 'Durban, KZN', 'Stripe', 2200),
  // createData(11, getCurrentDateFormatted(), 'Ethan Brown', 'Cape Town, WC', 'Stripe', 1750),
  // createData(12, getCurrentDateFormatted(), 'Isabella Davis', 'Bloemfontein, FS', 'Stripe', 410),
  // createData(13, getCurrentDateFormatted(), 'Liam Wilson', 'Port Elizabeth, EC', 'Stripe', 2950),
  // createData(14, getCurrentDateFormatted(), 'Olivia Martinez', 'East London, EC', 'Stripe', 3820),
  // createData(15, getCurrentDateFormatted(), 'Emma Thompson', 'Kimberley, NC', 'Stripe', 2200),
  // createData(16, getCurrentDateFormatted(), 'James Garcia', 'Nelspruit, MP', 'Stripe', 1750),
  // createData(17, getCurrentDateFormatted(), 'Noah Smith', 'Johannesburg, GT', 'Stripe', 410),
  // createData(18, getCurrentDateFormatted(), 'Ava Johnson', 'Pretoria, GT', 'Stripe', 2950),
  // createData(19, getCurrentDateFormatted(), 'William Brown', 'Polokwane, LP', 'Stripe', 3820),
  // createData(20, getCurrentDateFormatted(), 'Sophia Davis', 'Cape Town, WC', 'Stripe', 2200),
  // createData(21, getCurrentDateFormatted(), 'Ethan Wilson', 'Bloemfontein, FS', 'Stripe', 1750),
  // createData(22, getCurrentDateFormatted(), 'Isabella Martinez', 'Port Elizabeth, EC', 'Stripe', 410),
  // createData(23, getCurrentDateFormatted(), 'Liam Thompson', 'East London, EC', 'Stripe', 2950),
  // createData(24, getCurrentDateFormatted(), 'Olivia Garcia', 'Kimberley, NC', 'Stripe', 3820),
];

type Props = {};

export default function AdminOrdersPage() {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
      }}>
      <OrdersTable
        rows={rows}
        tableSize={isBelowSmall ? 'small' : 'medium'}
      />
    </Paper>
  );
}
