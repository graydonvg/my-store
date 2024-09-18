'use client';

import { useTheme } from '@mui/material/styles';
import { axisClasses, BarChart, ChartsTextStyle } from '@mui/x-charts';
import CardTitle from './CardTitle';
import { Box, Typography } from '@mui/material';
import { OrderDateTotal } from '@/types';
import dayjs from 'dayjs';
import { calculateTotalMonthlySales } from '@/utils/calculate';
import { formatCurrency } from '@/utils/format';

type Props = {
  orderData: OrderDateTotal[] | null;
};

export default function SalesBarChart({ orderData }: Props) {
  const theme = useTheme();
  const cumulativeSales = orderData ? calculateTotalMonthlySales(orderData) : null;
  const monthNames = Array.from(Array(12)).map((_, index) => dayjs().month(index).format('MMM'));

  return (
    <>
      <CardTitle gutterBottom>Sales This Year</CardTitle>

      <Box sx={{ width: 1, flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        {cumulativeSales ? (
          <BarChart
            dataset={cumulativeSales}
            margin={{
              top: 20,
              right: 15,
              left: 100,
              bottom: 55,
            }}
            xAxis={[
              {
                label: 'Month',
                dataKey: 'month',
                data: monthNames,
                scaleType: 'band',
                labelStyle: {
                  ...(theme.typography.body1 as ChartsTextStyle),
                  fill: theme.palette.text.primary,
                },
                tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              },
            ]}
            yAxis={[
              {
                label: 'Sales (R)',
                labelStyle: {
                  ...(theme.typography.body1 as ChartsTextStyle),
                  fill: theme.palette.text.primary,
                },
                tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              },
            ]}
            series={[
              {
                dataKey: 'totalSales',
                color: theme.palette.primary.light,
                valueFormatter: (value) => formatCurrency(value ?? 0),
              },
            ]}
            sx={{
              [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
              [`& .${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translateX(-60px)',
              },
              [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                transform: 'translateY(10px)',
              },
            }}
          />
        ) : (
          <Box sx={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}>
            <Typography sx={{ fontSize: { xs: 24, sm: 32 } }}>No data</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
