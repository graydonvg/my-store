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
// import StatCard, { StatCardProps } from '@/components/StatCard';
// import SalesBarChart from '@/components/SalesBartChart';
// import { analyticsDataClient } from '@/lib/google/client';
// import { sendGAEvent } from '@next/third-parties/google';

// const data: StatCardProps[] = [
//   {
//     title: 'Users',
//     value: '14k',
//     interval: 'Last 30 days',
//     trend: 'up',
//     data: [
//       200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380, 360, 400, 380, 420, 400, 640, 340,
//       460, 440, 480, 460, 600, 880, 920,
//     ],
//   },
//   {
//     title: 'Conversions',
//     value: '325',
//     interval: 'Last 30 days',
//     trend: 'down',
//     data: [
//       1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820, 780, 800, 760, 380, 740, 660, 620,
//       840, 500, 520, 480, 400, 360, 300, 220,
//     ],
//   },
//   {
//     title: 'Average Order Value',
//     value: '14k',
//     interval: 'Last 30 days',
//     trend: 'up',
//     data: [
//       200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380, 360, 400, 380, 420, 400, 640, 340,
//       460, 440, 480, 460, 600, 880, 920,
//     ],
//   },
//   {
//     title: 'Refund Rate',
//     value: '325',
//     interval: 'Last 30 days',
//     trend: 'down',
//     data: [
//       1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820, 780, 800, 760, 380, 740, 660, 620,
//       840, 500, 520, 480, 400, 360, 300, 220,
//     ],
//   },
// ];

export default async function AdminPanelDashboard() {
  const { page, sort, filter } = CONSTANTS.DATA_GRID_DEFAULTS;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);
  const orderTotalsThisYear = await fetchOrderTotalsThisYear();
  const sortedBestSellers = await fetchSortedBestSellers();
  const recentProducts = await fetchRecentProducts();
  // const report = await analyticsDataClient.runReport({
  //   property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID!}`,
  //   dateRanges: [
  //     {
  //       startDate: '2024-09-18',
  //       endDate: 'today',
  //     },
  //   ],
  //   dimensions: [
  //     {
  //       name: 'city',
  //     },
  //     {
  //       name: 'eventName', // Include eventName if you are tracking conversions as events
  //     },
  //   ],
  //   metrics: [
  //     {
  //       name: 'activeUsers',
  //     },
  //     {
  //       name: 'eventCount', // Metric for event-based conversions
  //     },
  //   ],
  // });

  // console.log(report[0]);

  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      {/* {data.map((card, index) => (
        <Grid2
          key={index}
          size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid2>
      ))} */}
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
