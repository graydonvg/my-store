import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@/components/adminView/Chart';
import TotalSales from '@/components/adminView/TotalSales';
import OrdersTable from '@/components/adminView/OrdersTable';
import { BORDER_RADIUS } from '@/config';
import CardTitleAdminView from '@/components/adminView/CardTitleAdminView';

function createData(id: number, date: string, name: string, shipTo: string, paymentMethod: string, amount: number) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function getCurrentDateFormatted() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const parts = formattedDate.split(' ');
  return `${parts[1]} ${parts[0]} ${parts[2]}`.replace(',', '');
}

const rows = [
  createData(0, getCurrentDateFormatted(), 'Sophia Smith', 'Johannesburg, GT', 'Stripe', 3496),
  createData(1, getCurrentDateFormatted(), 'Ethan Johnson', 'Cape Town, WC', 'Stripe', 2749),
  createData(2, getCurrentDateFormatted(), 'Isabella Brown', 'Durban, KZN', 'Stripe', 489),
  createData(3, getCurrentDateFormatted(), 'Liam Davis', 'Bloemfontein, FS', 'Stripe', 3199),
  createData(4, getCurrentDateFormatted(), 'Olivia Wilson', 'Port Elizabeth, EC', 'Stripe', 1580),
];

export default function Dashboard() {
  return (
    <>
      <Grid
        container
        spacing={3}>
        {/* Chart */}
        <Grid
          item
          xs={12}
          md={8}
          lg={9}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              borderRadius: BORDER_RADIUS,
            }}>
            <Chart />
          </Paper>
        </Grid>
        {/* Weekly Sales*/}
        <Grid
          item
          xs={12}
          md={4}
          lg={3}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              borderRadius: BORDER_RADIUS,
            }}>
            <TotalSales />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid
          item
          xs={12}>
          <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', borderRadius: BORDER_RADIUS }}>
            <CardTitleAdminView>Recent Orders</CardTitleAdminView>
            <OrdersTable rows={rows} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
