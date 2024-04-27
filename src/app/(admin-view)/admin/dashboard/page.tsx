import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@/components/adminView/Chart';
import TotalSales from '@/components/adminView/TotalSales';
import OrdersTable from '@/components/adminView/OrdersTable';
import { BORDER_RADIUS } from '@/config';
import CardTitleAdminView from '@/components/adminView/CardTitleAdminView';
import { getOrdersForAdmin } from '@/lib/db/queries/getOrders';
import { OrdersSortByOptions } from '@/types';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Dashboard({ searchParams }: Props) {
  const sortBy = (searchParams['sort_by'] as OrdersSortByOptions) ?? 'date';
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
          <Chart />
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
          <CardTitleAdminView>Recent Orders</CardTitleAdminView>
          <OrdersTable orders={orders} />
        </Paper>
      </Grid>
    </Grid>
  );
}
