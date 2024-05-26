import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SalesChart from '@/components/adminPanel/dashboard/SalesChart';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { constants } from '@/constants';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';
import BestSellers from '@/components/adminPanel/dashboard/BestSellers';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function DashboardAdminPanel() {
  const { page, sort, filter } = constants.dataGridDefaults;
  const { data: orderData } = await fetchOrdersForAdmin(page, sort, filter);

  // Clean up
  const supabase = await createSupabaseServerClient();

  const { data: bestSellers } = await supabase.rpc('getBestSellers');

  const bestSellerProductIds = bestSellers?.map((item) => item.productId);

  const { data: products } = await supabase
    .from('products')
    .select('*, productImageData(fileName, imageUrl, productImageId, index)')
    .in('productId', bestSellerProductIds ?? []);

  const sortedProductsWithTotalQuantitySold = products
    ?.map((product) => {
      const totalQuantitySold =
        bestSellers?.find((item) => item.productId === product.productId)?.totalQuantitySold ?? null;

      return {
        ...product,
        totalQuantitySold,
      };
    })
    ?.sort((a, b) => b.totalQuantitySold! - a.totalQuantitySold!);
  // fix b.totalQuantitySold! - a.totalQuantitySold!

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
            type="daily"
            amount={89285}
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
            type="weekly"
            amount={632485}
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
            type="monthly"
            amount={2362495}
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
          <SalesChart />
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
          <BestSellers bestSellers={sortedProductsWithTotalQuantitySold ?? []} />
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
