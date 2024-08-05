import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import dayjs from 'dayjs';
import {
  calculateSalesForCurrentDay,
  calculateSalesForCurrentMonth,
  calculateSalesForCurrentWeek,
} from '@/utils/calculate';
import fetchSortedBestSellers from '@/lib/db/queries/fetchSortedBestSellers';
import { CONSTANTS } from '@/constants';
import fetchRecentProducts from '@/lib/db/queries/fetchRecentProducts';
import RecentProducts from '@/components/adminPanel/dashboard/RecentProducts';
import SalesBarChart from '@/components/adminPanel/dashboard/SalesBarChart';
import fetchOrderTotalsThisYear from '@/lib/db/queries/fetchOrderTotalsThisYear';

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisYear = await fetchOrderTotalsThisYear();
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
            amount={orderTotalsThisYear ? calculateSalesForCurrentDay(orderTotalsThisYear) : null}
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
            amount={orderTotalsThisYear ? calculateSalesForCurrentWeek(orderTotalsThisYear) : null}
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
            amount={orderTotalsThisYear ? calculateSalesForCurrentMonth(orderTotalsThisYear) : null}
            date={dayjs().format('MMM')}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        xl={6}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 300, md: 360, lg: 420 },
            minHeight: { xs: 300, md: 360, lg: 420, xl: 1 },
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <SalesBarChart orderData={orderTotalsThisYear} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        lg={6}
        xl={3}>
        <Paper
          sx={{
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <RecentProducts recentProducts={recentProducts} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        lg={6}
        xl={3}>
        <Paper
          sx={{
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
          }}>
          <RecentOrdersTable orders={orderData.orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
