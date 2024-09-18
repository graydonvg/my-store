'use client';

import Typography from '@mui/material/Typography';
import CardTitle from './CardTitle';
import { formatCurrency } from '@/utils/format';
import { Box } from '@mui/material';

type Props = {
  title: string;
  amount: number | null;
  date: string;
};

export default function TotalSales({ title, date, amount }: Props) {
  return (
    <Box sx={{ height: 1 }}>
      <CardTitle gutterBottom>{title}</CardTitle>
      <Typography
        component="p"
        variant="h4"
        fontWeight={700}
        fontSize={28}
        noWrap>
        {amount !== null ? formatCurrency(amount) : 'No data'}
      </Typography>
      <Typography sx={{ color: (theme) => theme.palette.text.secondary }}>{date}</Typography>
    </Box>
  );
}
