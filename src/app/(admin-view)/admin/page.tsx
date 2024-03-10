'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@/components/adminView/Chart';
import Deposits from '@/components/adminView/Deposits';
import OrdersAdminView from '@/components/adminView/OrdersAdminView';
import useColorPalette from '@/hooks/useColorPalette';

export default function Dashboard() {
  return (
    <Container sx={{}}>
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
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid
          item
          xs={12}
          md={4}
          lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}>
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid
          item
          xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <OrdersAdminView />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
