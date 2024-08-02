import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SalesChart from '@/components/adminPanel/dashboard/SalesChart';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import dayjs from 'dayjs';
import { calculateDailySales, calculateMonthlySales, calculateWeeklySales } from '@/utils/calculate';
import fetchOrderTotalsThisMonth from '@/lib/db/queries/fetchOrderTotalsThisMonth';
import fetchSortedBestSellers from '@/lib/db/queries/fetchSortedBestSellers';
import { CONSTANTS } from '@/constants';
import fetchRecentProducts from '@/lib/db/queries/fetchRecentProducts';
import RecentProducts from '@/components/adminPanel/dashboard/RecentProducts';

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisMonth = await fetchOrderTotalsThisMonth();
  const sortedBestSellers = await fetchSortedBestSellers();
  const recentProducts = await fetchRecentProducts();

  return (
    <Grid
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 0 },
            minHeight: 'fit-content',
            borderRadius: CONSTANTS.BORDER_RADIUS,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Daily Sales"
            amount={orderTotalsThisMonth ? calculateDailySales(orderTotalsThisMonth) : null}
            date={dayjs().format('DD MMM')}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 0 },
            minHeight: 'fit-content',
            borderRadius: CONSTANTS.BORDER_RADIUS,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Weekly Sales"
            amount={orderTotalsThisMonth ? calculateWeeklySales(orderTotalsThisMonth) : null}
            date={`${dayjs().startOf('week').format('DD MMM')} - ${dayjs().endOf('week').format('DD MMM')}`}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{ display: { xs: 'block', sm: 'none', md: 'block' } }}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 0 },
            minHeight: 'fit-content',
            borderRadius: CONSTANTS.BORDER_RADIUS,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Monthly Sales"
            amount={orderTotalsThisMonth ? calculateMonthlySales(orderTotalsThisMonth) : null}
            date={dayjs().format('MMM')}
          />
        </Paper>
      </Grid>
      <Grid
        item
        sm={12}
        xl={6}
        sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { sm: 300, md: 360, lg: 420 },
            minHeight: { sm: 300, md: 360, lg: 420, xl: 1 },
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <SalesChart orderData={orderTotalsThisMonth} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={6}
        xl={3}>
        <Paper
          sx={{
            padding: 2,
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <RecentProducts recentProducts={recentProducts} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={6}
        xl={3}>
        <Paper
          sx={{
            padding: 2,
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <BestSellers bestSellers={sortedBestSellers} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: CONSTANTS.BORDER_RADIUS,
            overflow: 'hidden',
            padding: 2,
          }}>
          <RecentOrdersTable orders={orderData.orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
