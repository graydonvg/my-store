'use client';

import Typography from '@mui/material/Typography';
import CardTitle from './CardTitle';
import { formatCurrency } from '@/utils/format';
import { Box } from '@mui/material';
import CustomNoRowsOverlay from '@/components/dataGrid/CustomNoRowsOverlay';

type Props = {
  title: string;
  amount: number | null;
  label: string;
};

export default function TotalSales({ title, label, amount }: Props) {
  return (
    <Box sx={{ height: 1 }}>
      <CardTitle>{title}</CardTitle>
      {amount ? (
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
            {formatCurrency(amount)}
          </Typography>
          <Typography color={(theme) => theme.palette.text.secondary}>{label}</Typography>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CustomNoRowsOverlay text="No data received" />
        </Box>
      )}
    </Box>
  );
}
