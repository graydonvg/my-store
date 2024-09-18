import Grid2 from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import { calculateSalesOverPeriod } from '@/utils/calculate';
import fetchSortedBestSellers from '@/lib/db/queries/fetchSortedBestSellers';
import { CONSTANTS } from '@/constants';
import fetchRecentProducts from '@/lib/db/queries/fetchRecentProducts';
import RecentProducts from '@/components/adminPanel/dashboard/RecentProducts';
import SalesBarChart from '@/components/adminPanel/dashboard/SalesBarChart';
import fetchOrderTotalsThisYear from '@/lib/db/queries/fetchOrderTotalsThisYear';
import TotalsCard from '@/components/adminPanel/dashboard/TotalsCard';
import dayjs from 'dayjs';

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisYear = await fetchOrderTotalsThisYear();
  const sortedBestSellers = await fetchSortedBestSellers();
  const recentProducts = await fetchRecentProducts();

  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <TotalsCard>
          <TotalSales
            title="Daily Sales"
            amount={orderTotalsThisYear ? calculateSalesOverPeriod('day', orderTotalsThisYear) : null}
            date={dayjs().format('DD MMM')}
          />
        </TotalsCard>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <TotalsCard>
          <TotalSales
            title="Weekly Sales"
            amount={orderTotalsThisYear ? calculateSalesOverPeriod('week', orderTotalsThisYear) : null}
            date={`${dayjs().startOf('week').format('DD MMM')} - ${dayjs().endOf('week').format('DD MMM')}`}
          />
        </TotalsCard>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <TotalsCard>
          <TotalSales
            title="Monthly Sales"
            amount={orderTotalsThisYear ? calculateSalesOverPeriod('month', orderTotalsThisYear) : null}
            date={dayjs().format('MMM')}
          />
        </TotalsCard>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <TotalsCard>
          <TotalSales
            title="Yearly Sales"
            amount={orderTotalsThisYear ? calculateSalesOverPeriod('year', orderTotalsThisYear) : null}
            date={dayjs().format('YYYY')}
          />
        </TotalsCard>
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>
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
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <Paper
          sx={{
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <RecentProducts recentProducts={recentProducts} />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <Paper
          sx={{
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}>
          <BestSellers bestSellers={sortedBestSellers} />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: CONSTANTS.BORDER_RADIUS,
            overflow: 'hidden',
          }}>
          <RecentOrdersTable orders={orderData.orders} />
        </Paper>
      </Grid2>
    </Grid2>
  );
}
