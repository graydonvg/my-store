'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { Paper, darken } from '@mui/material';
import { calculateTotalMonthlyConversions, calculateTotalMonthlySales } from '@/utils/calculate';
import dayjs from 'dayjs';
import { OrderDateTotal } from '@/types';
import { formatCurrency } from '@/utils/format';

type Props = {
  monthlyPageViews: number[];
  orderData: OrderDateTotal[] | null;
};

export default function PageViewsAndSalesBarChart({ monthlyPageViews, orderData }: Props) {
  const theme = useTheme();
  const cumulativeSales = orderData ? calculateTotalMonthlySales(orderData) : undefined;
  const monthlyConversions = orderData ? calculateTotalMonthlyConversions(orderData) : undefined;
  const totalSales = orderData?.reduce((acc, order) => {
    return (acc += order.orderTotal);
  }, 0);
  const monthNames = Array.from(Array(12)).map((_, index) => dayjs().month(index).format('MMM'));
  const barColors = [theme.palette.primary.dark, theme.palette.primary.main, theme.palette.primary.light];

  return (
    <Paper
      sx={{
        width: '100%',
        padding: 2,
        paddingBottom: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? darken(theme.palette.grey[900], 0.3) : theme.palette.background.paper,
      }}>
      <Typography
        component="h2"
        variant="subtitle2"
        gutterBottom>
        Page views and sales
      </Typography>
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
          {/* <Chip
            size="small"
            color="error"
            label="-8%"
          /> */}
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
            data: cumulativeSales,
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
        height={250}
        margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
    </Paper>
  );
}
