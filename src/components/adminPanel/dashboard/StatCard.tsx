'use client';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { darken, Paper } from '@mui/material';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/format';
import CardTitle from './CardTitle';
import { calculatePercentageChange } from '@/utils/calculate';

type StatCardProps = {
  title: string;
  numberOfDays: number;
  currentPeriodData: number[];
  periodTotals: {
    currentPeriod: number;
    previousPeriod: number;
  };
  isCurrency?: boolean;
  isPercentage?: boolean;
};

function getTrend(currentPeriod: number, previousPeriod: number): 'up' | 'down' | 'neutral' {
  let trend = 'neutral';

  if (currentPeriod - previousPeriod > 0) trend = 'up';
  if (currentPeriod - previousPeriod < 0) trend = 'down';

  return trend as 'up' | 'down' | 'neutral';
}

function getDates(numberOfDays: number) {
  const today = dayjs();
  const last30Days = today.subtract(numberOfDays, 'day');

  const datesLast30Days = [];

  for (let i = 0; i < numberOfDays; i++) {
    datesLast30Days.push(last30Days.add(i, 'day').format('YYYY-MM-DD'));
  }
  return datesLast30Days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient
        id={id}
        x1="50%"
        y1="0%"
        x2="50%"
        y2="100%">
        <stop
          offset="0%"
          stopColor={color}
          stopOpacity={0.3}
        />
        <stop
          offset="100%"
          stopColor={color}
          stopOpacity={0}
        />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({
  title,
  numberOfDays,
  currentPeriodData,
  periodTotals,
  isCurrency = false,
  isPercentage = false,
}: StatCardProps) {
  const theme = useTheme();
  const daysInWeek = getDates(numberOfDays);
  const trend = getTrend(periodTotals.currentPeriod, periodTotals.previousPeriod);
  const percentageChange = calculatePercentageChange(periodTotals.currentPeriod, periodTotals.previousPeriod);
  let value = handleValueFormat(periodTotals.currentPeriod);

  const trendColors = {
    up: theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark,
    down: theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark,
    neutral: theme.palette.mode === 'light' ? theme.palette.grey[400] : theme.palette.grey[700],
  };

  const badgeColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const badgeColor = badgeColors[trend];
  const chartColor = trendColors[trend];
  const trendSymbol = { up: '+', down: '', neutral: '' };

  function handleValueFormat(value: number) {
    if (isCurrency) return formatCurrency(value);

    if (isPercentage) return `${value.toFixed(2)}%`;

    return `${value}`;
  }

  return (
    <Paper
      sx={{
        height: '100%',
        flexGrow: 1,
        padding: 2,
        paddingBottom: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? darken(theme.palette.grey[900], 0.3) : theme.palette.background.paper,
      }}>
      <CardTitle gutterBottom>{title}</CardTitle>
      <Stack
        direction="column"
        sx={{ justifyContent: 'space-between', flexGrow: 1, gap: 1 }}>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h4"
              component="p">
              {value}
            </Typography>
            <Chip
              size="small"
              color={badgeColor}
              label={`${trendSymbol[trend]}${Math.round(percentageChange)}%`}
            />
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary' }}>
            Last {numberOfDays} days
          </Typography>
        </Stack>
        <Box sx={{ width: '100%', height: 50 }}>
          <SparkLineChart
            colors={[chartColor]}
            data={currentPeriodData}
            area
            showHighlight
            showTooltip
            valueFormatter={(value) => handleValueFormat(value ?? 0)}
            xAxis={{
              scaleType: 'band',
              data: daysInWeek,
            }}
            sx={{
              [`& .${areaElementClasses.root}`]: {
                fill: `url(#area-gradient-${periodTotals.currentPeriod})`,
              },
            }}>
            <AreaGradient
              color={chartColor}
              id={`area-gradient-${periodTotals.currentPeriod}`}
            />
          </SparkLineChart>
        </Box>
      </Stack>
    </Paper>
  );
}
