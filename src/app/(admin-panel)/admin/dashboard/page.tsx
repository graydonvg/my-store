import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SalesChart from '@/components/adminPanel/dashboard/SalesChart';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { constants } from '@/constants';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';
import { calculateDailySales, calculateMonthlySales, calculateWeeklySales } from '@/utils/calculate';

export default async function DashboardAdminPanel() {
  const { page, sort, filter } = constants.dataGridDefaults;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);

  // Clean up
  const supabase = await createSupabaseServerClient();

  // Sales data \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const startOfMonth = dayjs().startOf('month');
  const now = dayjs();

  const { data: orderTotalsThisMonth } = await supabase
    .from('orders')
    .select('createdAt, orderTotal')
    .or('orderStatus.eq.paid, orderStatus.eq.processing, orderStatus.eq.shipped, orderStatus.eq.delivered')
    .gte('createdAt', startOfMonth)
    .lte('createdAt', now);

  // Best sellers \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const { data: bestSellers } = await supabase.rpc('getBestSellers');

  let sortedProductsWithTotalQuantitySold = null;

  if (bestSellers) {
    const bestSellerProductIds = bestSellers.map((item) => item.productId);

    const { data: products } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .in('productId', bestSellerProductIds);

    if (products) {
      sortedProductsWithTotalQuantitySold = products
        .map((product) => {
          const totalQuantitySold =
            bestSellers.find((item) => item.productId === product.productId)?.totalQuantitySold ?? 0;

          return {
            ...product,
            totalQuantitySold,
          };
        })
        .sort((a, b) => (b.totalQuantitySold ?? 0) - (a.totalQuantitySold ?? 0));
    }
  }

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
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Daily Sales"
            amount={orderTotalsThisMonth ? calculateDailySales(orderTotalsThisMonth) : null}
            label={dayjs().format('DD MMM')}
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
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Weekly Sales"
            amount={orderTotalsThisMonth ? calculateWeeklySales(orderTotalsThisMonth) : null}
            label={`${dayjs().startOf('week').format('DD MMM')} - ${dayjs().endOf('week').format('DD MMM')}`}
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
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Monthly Sales"
            amount={orderTotalsThisMonth ? calculateMonthlySales(orderTotalsThisMonth) : null}
            label={dayjs().format('MMM')}
          />
        </Paper>
      </Grid>
      <Grid
        item
        sm={12}
        xl={7}
        sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { sm: 300, md: 360, lg: 420 },
            minHeight: { sm: 300, md: 360, lg: 420, xl: 1 },
            borderRadius: constants.borderRadius,
          }}>
          <SalesChart orderData={orderTotalsThisMonth} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        xl={5}>
        <Paper
          sx={{
            padding: 2,
            borderRadius: constants.borderRadius,
            zIndex: -2,
          }}>
          <BestSellers bestSellers={sortedProductsWithTotalQuantitySold} />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: constants.borderRadius,
            overflow: 'hidden',
            padding: 2,
          }}>
          <RecentOrdersTable orders={orderData.orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
