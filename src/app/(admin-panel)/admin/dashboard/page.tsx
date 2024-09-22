import Grid2 from '@mui/material/Grid2';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import fetchSortedBestSellers from '@/lib/db/queries/fetchSortedBestSellers';
import { CONSTANTS } from '@/constants';
import fetchRecentProducts from '@/lib/db/queries/fetchRecentProducts';
import RecentProducts from '@/components/adminPanel/dashboard/RecentProducts';
import fetchOrderTotalsThisYear from '@/lib/db/queries/fetchOrderTotalsThisYear';
import StatCard from '@/components/adminPanel/dashboard/StatCard';
import PageViewsAndSalesBarChart from '@/components/adminPanel/dashboard/PageViewsAndSalesBarChart';
import { getActiveUsersData } from '@/lib/googleAnalytics/activeUsers';
import { getMonthlyPageViewsForYear } from '@/lib/googleAnalytics/pageViews';
import { calculateAverageOrderValues, calculateTotalConversions, calculateRefundRates } from '@/utils/calculate';
import fetchUnsuccessfulOrderDates from '@/lib/db/queries/fetchRefundedOrders';

const NUMBER_OF_DAYS_FOR_REPORT = 30;
const DAYS_OF_DATA_TO_FETCH = NUMBER_OF_DAYS_FOR_REPORT * 2;

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisYear = await fetchOrderTotalsThisYear();
  const refundedOrders = await fetchUnsuccessfulOrderDates(DAYS_OF_DATA_TO_FETCH);
  const sortedBestSellers = await fetchSortedBestSellers();
  const recentProducts = await fetchRecentProducts();
  const { currentPeriodUsers, totalCurrentUsers, totalPreviousUsers } = await getActiveUsersData(DAYS_OF_DATA_TO_FETCH);
  const monthlyPageViews = await getMonthlyPageViewsForYear();
  const totalConversions = orderTotalsThisYear && calculateTotalConversions(orderTotalsThisYear, DAYS_OF_DATA_TO_FETCH);
  const averageOrderValues =
    orderTotalsThisYear && calculateAverageOrderValues(orderTotalsThisYear, DAYS_OF_DATA_TO_FETCH);
  const refundRates =
    orderTotalsThisYear &&
    refundedOrders &&
    calculateRefundRates(orderTotalsThisYear, refundedOrders, DAYS_OF_DATA_TO_FETCH);

  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Active Users"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          currentPeriodData={currentPeriodUsers}
          periodTotals={{ currentPeriod: totalCurrentUsers, previousPeriod: totalPreviousUsers }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Conversions"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          currentPeriodData={totalConversions?.currentPeriodConversions ?? []}
          periodTotals={{
            currentPeriod: totalConversions?.totalCurrentPeriodConversions ?? 0,
            previousPeriod: totalConversions?.totalPreviosPeriodConversions ?? 0,
          }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Average Order Value"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          currentPeriodData={averageOrderValues?.currentPeriodDailyAverageOrderValues ?? []}
          periodTotals={{
            currentPeriod: averageOrderValues?.totalAverageCurrentPeriod ?? 0,
            previousPeriod: averageOrderValues?.totalAveragePreviousPeriod ?? 0,
          }}
          isCurrency
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Refund Rate"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          currentPeriodData={refundRates?.currentPeriodRefundRates ?? []}
          periodTotals={{
            currentPeriod: refundRates?.overallCurrentPeriodRefundRate ?? 0,
            previousPeriod: refundRates?.overallPreviousPeriodRefundRate ?? 0,
          }}
          isPercentage
        />
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <PageViewsAndSalesBarChart
          monthlyPageViews={monthlyPageViews}
          orderData={orderTotalsThisYear}
        />
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
