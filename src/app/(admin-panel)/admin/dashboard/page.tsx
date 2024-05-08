import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChartAdminPanel from '@/components/adminPanel/ChartAdminPanel';
import TotalSales from '@/components/adminPanel/TotalSales';
import OrdersTable from '@/components/adminPanel/OrdersTable';
import { BORDER_RADIUS } from '@/data';
import CardTitle from '@/components/adminPanel/CardTitle';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { AdminOrdersDataGridSortableColumns } from '@/types';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminDashboard({ searchParams }: Props) {
  const sortBy = (searchParams['sort_by'] as AdminOrdersDataGridSortableColumns) ?? 'date';
  const sortDirection = (searchParams['sort'] as 'asc' | 'desc') ?? 'desc';

  const { orders } = await getOrdersForAdmin(0, 4, sortBy, sortDirection);

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
          <CardTitle>Recent Orders</CardTitle>
          <OrdersTable orders={orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
