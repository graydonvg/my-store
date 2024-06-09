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
      <CardTitle>{title}</CardTitle>

      <>
        <Typography
          component="p"
          variant="h4"
          noWrap
          sx={{
            fontSize: 36,
            '@container (max-width: 231px)': {
              fontSize: 30,
            },
            '@container (max-width: 195px)': {
              fontSize: 24,
            },
            '@container (max-width: 155px)': {
              fontSize: 22,
            },
          }}>
          {amount !== null ? formatCurrency(amount) : 'No data'}
        </Typography>
        <Typography color={(theme) => theme.palette.text.secondary}>{date}</Typography>
      </>
    </Box>
  );
}
