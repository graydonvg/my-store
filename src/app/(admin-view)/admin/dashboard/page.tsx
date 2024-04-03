'use client';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@/components/adminView/Chart';
import TotalSales from '@/components/adminView/TotalSales';
import OrdersTable from '@/components/adminView/OrdersTable';

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
            }}>
            <TotalSales />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid
          item
          xs={12}>
          <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
            <OrdersTable />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
