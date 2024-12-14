import Grid2 from '@mui/material/Grid2';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { fetchOrdersForAdmin } from '@/services/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import fetchSortedBestSellers from '@/services/db/queries/fetchSortedBestSellers';
import { DATA_GRID_DEFAULTS } from '@/constants';
import fetchRecentProducts from '@/services/db/queries/fetchRecentProducts';
import RecentProducts from '@/components/adminPanel/dashboard/RecentProducts';
import fetchOrderTotalsThisYear from '@/services/db/queries/fetchOrderTotalsThisYear';
import StatCard from '@/components/adminPanel/dashboard/StatCard';
import SalesAndConversionsBarChart from '@/components/adminPanel/dashboard/SalesAndConversionsBarChart';
import {
  calculateAverageOrderValues,
  calculateTotalConversions,
  calculateRefundRates,
  calculateTotalRegisteredCustomers,
} from '@/utils/calculations';
import fetchPreviousYearSalesTotal from '@/services/db/queries/fetchPreviousYearSalesTotal';
import fetchRegisteredUsersByDate from '@/services/db/queries/fetchRegisteredCustomersByDate';
import fetchReversedOrdersByDate from '@/services/db/queries/fetchReversedOrdersByDate';
import { Logger } from 'next-axiom';

type ResultKeys =
  | 'orderDataResponse'
  | 'previousYearSalesTotal'
  | 'orderTotalsThisYear'
  | 'registeredUsers'
  | 'reversedOrders'
  | 'sortedBestSellers'
  | 'recentProducts';

const NUMBER_OF_DAYS_FOR_REPORT = 30;
const DAYS_OF_DATA_TO_FETCH = NUMBER_OF_DAYS_FOR_REPORT * 2;

export default async function AdminPanelDashboard() {
  const log = new Logger();
  const { page, sort, filter } = DATA_GRID_DEFAULTS;

  const results = await Promise.allSettled([
    fetchOrdersForAdmin(page, sort, filter),
    fetchPreviousYearSalesTotal(),
    fetchOrderTotalsThisYear(),
    fetchRegisteredUsersByDate(DAYS_OF_DATA_TO_FETCH),
    fetchReversedOrdersByDate(DAYS_OF_DATA_TO_FETCH),
    fetchSortedBestSellers(),
    fetchRecentProducts(),
  ]);

  const resultsMap: Partial<Record<ResultKeys, any>> = {};

  const resultKeys: ResultKeys[] = [
    'orderDataResponse',
    'previousYearSalesTotal',
    'orderTotalsThisYear',
    'registeredUsers',
    'reversedOrders',
    'sortedBestSellers',
    'recentProducts',
  ];

  resultKeys.forEach((key, index) => {
    if (results[index].status === 'fulfilled') {
      resultsMap[key] = results[index].value;
    } else {
      log.error(`Failed to fetch ${key}:`, { reason: results[index].reason });
    }
  });

  const {
    orderDataResponse,
    previousYearSalesTotal,
    orderTotalsThisYear,
    registeredUsers,
    reversedOrders,
    sortedBestSellers,
    recentProducts,
  } = resultsMap;

  const totalRegistrations =
    registeredUsers && calculateTotalRegisteredCustomers(registeredUsers, DAYS_OF_DATA_TO_FETCH);
  const totalConversions = orderTotalsThisYear && calculateTotalConversions(orderTotalsThisYear, DAYS_OF_DATA_TO_FETCH);
  const averageOrderValues =
    orderTotalsThisYear && calculateAverageOrderValues(orderTotalsThisYear, DAYS_OF_DATA_TO_FETCH);
  const refundRates =
    orderTotalsThisYear &&
    reversedOrders &&
    calculateRefundRates(orderTotalsThisYear, reversedOrders, DAYS_OF_DATA_TO_FETCH);
  const { data: orderData } = orderDataResponse || {};

  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid2 size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Registered Users"
          numberOfDays={NUMBER_OF_DAYS_FOR_REPORT}
          currentPeriodData={totalRegistrations?.currentPeriodRegistrations ?? []}
          periodTotals={{
            currentPeriod: totalRegistrations?.totalCurrentPeriodRegistrations ?? 0,
            previousPeriod: totalRegistrations?.totalPreviosPeriodRegistrations ?? 0,
          }}
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
          isReverseTrend
        />
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <SalesAndConversionsBarChart
          orderData={orderTotalsThisYear}
          previousYearSalesTotal={previousYearSalesTotal ?? 0}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <RecentProducts recentProducts={recentProducts} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <BestSellers bestSellers={sortedBestSellers} />
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <RecentOrdersTable orders={orderData?.orders ?? null} />
      </Grid2>
    </Grid2>
  );
}
