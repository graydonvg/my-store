import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@/components/adminView/Chart';
import TotalSales from '@/components/adminView/TotalSales';
import OrdersTable from '@/components/adminView/OrdersTable';
import { BORDER_RADIUS } from '@/config';
import CardTitleAdminView from '@/components/adminView/CardTitleAdminView';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';

export default async function Dashboard() {
  const orders = await getOrdersForAdmin(0, 4);

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}>
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
          <Chart />
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}>
        <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', borderRadius: BORDER_RADIUS }}>
          <CardTitleAdminView>Recent Orders</CardTitleAdminView>
          <OrdersTable
            orders={orders}
            tableSize="small"
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
