'use client';

import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import CardTitle from './CardTitle';
import { Box } from '@mui/material';

// Generate Sales Data
function createData(date: string, amount?: number): { date: string; amount: number | null } {
  return { date, amount: amount ?? null };
}

const data = [
  createData('1st'),
  createData('7th', 12000),
  createData('14th', 64000),
  createData('21st', 184000),
  createData('28th', 360000),
  createData('31st', 720000),
];

export default function SalesChart() {
  const theme = useTheme();

  return (
    <>
      <CardTitle>This month</CardTitle>
      <Box sx={{ width: 1, flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 20,
            right: 15,
            left: 100,
            bottom: 50,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'date',
              tickNumber: 1,
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              label: 'Date',
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
              max: 2500000,
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
            [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
              transform: 'translateY(10px)',
            },
          }}
        />
      </Box>
    </>
  );
}
