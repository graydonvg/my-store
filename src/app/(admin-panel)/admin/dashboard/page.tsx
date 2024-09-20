import Grid2 from '@mui/material/Grid2';
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
import StatCard from '@/components/StatCard';
// import SalesBarChart from '@/components/SalesBartChart';
import {
  ActiveUsers,
  calculateActiveUserTotalsAndPercentageChange,
  fetchActiveUsersForDays,
  prepareActiveUsersArrays,
  processActiveUsers,
} from '@/lib/googleAnalytics/activeUsers';

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisYear = await fetchOrderTotalsThisYear();
  const sortedBestSellers = await fetchSortedBestSellers();
  const recentProducts = await fetchRecentProducts();
  // const today = dayjs();
  // const startOfYear = today.startOf('year').format('YYYY-MM-DD');
  const NUMBER_OF_DAYS_FOR_REPORT = 30;
  const DAYS_TO_FETCH_DATA = NUMBER_OF_DAYS_FOR_REPORT * 2;
  const activeUsers = await fetchActiveUsersForDays(DAYS_TO_FETCH_DATA);
  const activeUsersMap = processActiveUsers(activeUsers as ActiveUsers);
  const { currentPeriodUsers, previousPeriodUsers } = prepareActiveUsersArrays(activeUsersMap, DAYS_TO_FETCH_DATA);
  const { totalCurrentUsers, totalPreviousUsers, percentageChange } = calculateActiveUserTotalsAndPercentageChange(
    currentPeriodUsers,
    previousPeriodUsers
  );

  // const pageViewsThisYear = await analyticsDataClient.runReport({
  //   property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
  //   dateRanges: [
  //     {
  //       startDate: startOfYear, // Start of the current year for monthly page views.
  //       endDate: today.format('YYYY-MM-DD'), // Today's date
  //     },
  //   ],
  //   dimensions: [
  //     {
  //       name: 'month', // First dimension for monthly breakdown.
  //     },
  //   ],
  //   metrics: [
  //     {
  //       name: 'screenPageViews', // Metric for page views.
  //     },
  //   ],
  // });

  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      {/* <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}> */}
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <StatCard
          title="Active Users"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          value={totalCurrentUsers}
          currentPeriodData={currentPeriodUsers}
          periodTotals={{ currentPeriod: totalCurrentUsers, previousPeriod: totalPreviousUsers }}
          percentageChange={Number(percentageChange.toFixed(2))}
        />
      </Grid2>
      {/* <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <TotalsCard>
          <TotalSales
            title="Daily Sales"
            amount={orderTotalsThisYear ? calculateSalesOverPeriod('day', orderTotalsThisYear) : null}
            date={dayjs().format('DD MMM')}
          />
        </TotalsCard>
      </Grid2> */}
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
        {/* <SalesBarChart /> */}
        <SalesBarChart orderData={orderTotalsThisYear} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <RecentProducts recentProducts={recentProducts} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <BestSellers bestSellers={sortedBestSellers} />
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <RecentOrdersTable orders={orderData.orders} />
      </Grid2>
    </Grid2>
  );
}
