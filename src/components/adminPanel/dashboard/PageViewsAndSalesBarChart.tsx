'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';
import {
  calculatePercentageChange,
  calculateTotalMonthlyConversions,
  calculateTotalMonthlySales,
} from '@/utils/calculations';
import dayjs from 'dayjs';
import { OrderDateTotal } from '@/types';
import { formatCurrency } from '@/utils/formatting';
import CardTitle from './CardTitle';
import { AdminDashboardCard } from './AdminDashboradCard';

type Props = {
  monthlyPageViews: number[];
  orderData: OrderDateTotal[] | null;
  previousYearSalesTotal: number;
};

function getTrend(currentPeriod: number, previousPeriod: number): 'up' | 'down' | 'neutral' {
  let trend = 'neutral';

  if (currentPeriod - previousPeriod > 0) trend = 'up';
  if (currentPeriod - previousPeriod < 0) trend = 'down';

  return trend as 'up' | 'down' | 'neutral';
}

export default function PageViewsAndSalesBarChart({ monthlyPageViews, orderData, previousYearSalesTotal }: Props) {
  const theme = useTheme();
  const monthlySales = orderData ? calculateTotalMonthlySales(orderData) : undefined;
  const monthlyConversions = orderData ? calculateTotalMonthlyConversions(orderData) : undefined;
  const totalSales = orderData?.reduce((acc, order) => {
    return (acc += order.orderTotal);
  }, 0);
  const percentageChange = calculatePercentageChange(totalSales ?? 0, previousYearSalesTotal);
  const trend = getTrend(totalSales ?? 0, previousYearSalesTotal);
  const monthNames = Array.from(Array(12)).map((_, index) => dayjs().month(index).format('MMM'));
  const barColors = [theme.palette.primary.dark, theme.palette.primary.main, theme.palette.primary.light];

  const badgeColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const badgeColor = badgeColors[trend];
  const trendSymbol = { up: '+', down: '', neutral: '' };

  return (
    <AdminDashboardCard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          paddingBottom: 3,
          height: { xs: 449, sm: 557.58 },
          minHeight: 1,
        }}>
        <CardTitle gutterBottom>Page views and sales</CardTitle>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}>
            <Typography
              variant="h4"
              component="p">
              {formatCurrency(totalSales ?? 0)}
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
            Page views and sales for the current year
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={barColors}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: monthNames,
              },
            ] as any
          }
          series={[
            {
              id: 'page-views',
              label: 'Page views',
              data: monthlyPageViews,
              stack: 'A',
            },
            {
              id: 'sales',
              label: 'Sales',
              data: monthlySales,
              stack: 'A',
              valueFormatter: (value) => formatCurrency(value ?? 0),
            },
            {
              id: 'conversions',
              label: 'Conversions',
              data: monthlyConversions,
              stack: 'A',
            },
          ]}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </Box>
    </AdminDashboardCard>
  );
}
