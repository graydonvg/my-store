import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SalesChart from '@/components/adminPanel/dashboard/SalesChart';
import TotalSales from '@/components/adminPanel/dashboard/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/dashboard/RecentOrdersTable';
import { constants } from '@/constants';
import { fetchOrdersForAdmin } from '@/lib/db/queries/fetchOrders';

export default async function DashboardAdminPanel() {
  const { page, sort, filter } = constants.dataGridDefaults;
  const { data } = await fetchOrdersForAdmin(page, sort, filter);

  return (
    <Grid
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid
        item
        xs={12}
        sm={4}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 180, sm: 240 },
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Daily Sales"
            type="daily"
            amount={842000}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 180, sm: 240 },
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Weekly Sales"
            type="weekly"
            amount={5863000}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 180, sm: 240 },
            borderRadius: constants.borderRadius,
            containerType: 'inline-size',
          }}>
          <TotalSales
            title="Monthly Sales"
            type="monthly"
            amount={162745000}
          />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}>
        <Paper
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 240, sm: 360 },
            borderRadius: constants.borderRadius,
          }}>
          <SalesChart />
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
          <RecentOrdersTable orders={data.orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
