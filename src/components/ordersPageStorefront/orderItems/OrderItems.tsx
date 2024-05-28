import { Box, Divider, Grid, useMediaQuery, useTheme } from '@mui/material';
import { CONSTANTS } from '@/constants';
import { OrderData } from '@/types';
import OrderItemImage from './OrderItemImage';
import OrderItemDetails from './OrderItemDetails';

type Props = {
  order: OrderData;
};

export default function OrderItems({ order }: Props) {
  const theme = useTheme();
  const isBelowLarge = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.custom.border}`,
        borderTop: { xs: 'none', md: `1px solid ${theme.palette.custom.border}` },
        padding: 2,
        borderRadius: { xs: 'none', md: CONSTANTS.BORDER_RADIUS },
        borderBottomLeftRadius: CONSTANTS.BORDER_RADIUS,
        borderBottomRightRadius: CONSTANTS.BORDER_RADIUS,
      })}>
      <Grid
        container
        spacing={2}>
        {order.orderItems.map((item, index) => {
          const numberOfItems = order.orderItems.length;
          const isFirstItem = index === 0;
          const isSecondItem = index === 1;
          const isSecondLastItem = numberOfItems - 2 === index;
          const isLastItem = numberOfItems - 1 === index;

          return (
            <Grid
              key={item.orderItemId}
              item
              xs={12}
              lg={6}>
              <Grid
                container
                spacing={2}
                sx={{
                  paddingBottom: {
                    xs: numberOfItems > 1 && !isLastItem ? 2 : 0,
                    lg: numberOfItems > 2 && !isLastItem && !isFirstItem && !isSecondItem && !isSecondLastItem ? 2 : 0,
                  },
                }}>
                <Grid
                  item
                  xs={4}
                  md={2}
                  lg={4}>
                  <OrderItemImage
                    orderItem={item}
                    imageUrl={item.product?.productImageData[0].imageUrl ?? ''}
                  />
                </Grid>
                <Grid
                  item
                  xs={8}
                  md={10}
                  lg={8}>
                  <OrderItemDetails orderItem={item} />
                </Grid>
              </Grid>
              {isBelowLarge && !isLastItem ? <Divider sx={{ borderColor: theme.palette.custom.border }} /> : null}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
