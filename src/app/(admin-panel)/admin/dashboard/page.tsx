import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChartAdminPanel from '@/components/adminPanel/ChartAdminPanel';
import TotalSales from '@/components/adminPanel/TotalSales';
import RecentOrdersTable from '@/components/adminPanel/RecentOrdersTable';
import { BORDER_RADIUS, DATA_GRID_DEFAULTS } from '@/data';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';

export default async function DashboardAdminPanel() {
  const { page, sort, filter } = DATA_GRID_DEFAULTS;
  const { data } = await getOrdersForAdmin(page, sort, filter);

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
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
            borderRadius: BORDER_RADIUS,
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
            borderRadius: BORDER_RADIUS,
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
            borderRadius: BORDER_RADIUS,
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
            borderRadius: BORDER_RADIUS,
          }}>
          <ChartAdminPanel />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden',
            padding: 2,
          }}>
          <RecentOrdersTable orders={data.orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
