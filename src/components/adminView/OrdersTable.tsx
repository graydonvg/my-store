'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import MuiLink from '../ui/MuiLink';

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
];

type Props = {
  tableSize: 'small' | 'medium';
  rows: {
    id: number;
    date: string;
    name: string;
    shipTo: string;
    paymentMethod: string;
    amount: number;
  }[];
};

export default function OrdersTable({ rows, tableSize }: Props) {
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <MuiLink>385e14d2-8b7a-4142-8472-c34466202fe6</MuiLink>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell>{formatCurrency(row.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
