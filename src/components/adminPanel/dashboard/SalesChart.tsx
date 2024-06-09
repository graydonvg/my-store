'use client';

import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import CardTitle from './CardTitle';
import { Box, Typography } from '@mui/material';
import { calculateCumulativeSales } from '@/utils/calculate';
import { MonthlyOrderData } from '@/types';

type Props = {
  orderData: MonthlyOrderData[] | null;
};

export default function SalesChart({ orderData }: Props) {
  const theme = useTheme();
  const cumulativeSales = orderData ? calculateCumulativeSales(orderData) : null;

  return (
    <>
      <CardTitle>This month</CardTitle>

      <Box sx={{ width: 1, flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        {cumulativeSales ? (
          <LineChart
            dataset={cumulativeSales}
            margin={{
              top: 20,
              right: 15,
              left: 100,
              bottom: 55,
            }}
            xAxis={[
              {
                label: 'Day',
                dataKey: 'day',
                scaleType: 'linear',
                tickMinStep: 1,
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
                dataKey: 'amount',
                showMark: false,
                color: theme.palette.primary.light,
              },
            ]}
            sx={{
              [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
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
