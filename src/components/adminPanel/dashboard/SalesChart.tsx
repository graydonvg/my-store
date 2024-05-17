'use client';

import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import CardTitle from './CardTitle';
import { Box } from '@mui/material';

// Generate Sales Data
function createData(time: string, amount?: number): { time: string; amount: number | null } {
  return { time, amount: amount ?? null };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 12000),
  createData('06:00', 64000),
  createData('09:00', 184000),
  createData('12:00', 360000),
  createData('15:00', 582000),
  createData('18:00', 796000),
  createData('21:00', 842000),
  createData('24:00'),
];

export default function SalesChart() {
  const theme = useTheme();

  return (
    <>
      <CardTitle>Today</CardTitle>
      <Box sx={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 100,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
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
              max: 1000000,
              tickNumber: 4,
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
          }}
        />
      </Box>
    </>
  );
}
