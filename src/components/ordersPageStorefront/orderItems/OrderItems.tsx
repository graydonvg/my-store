import { Box, Divider, Grid, useMediaQuery, useTheme } from '@mui/material';
import { BORDER_RADIUS } from '@/data';
import { OrderData } from '@/types';
import OrderDetails from '../orderDetails/OrderDetails';
import OrderItemImage from './OrderItemImage';
import OrderItemDetails from './OrderItemDetails';

type Props = {
  order: OrderData;
  borderColor: string;
};

export default function OrderItems({ borderColor, order }: Props) {
  const theme = useTheme();
  const isBelowLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid
      item
      xs={12}
      md={8}>
      {isBelowMedium ? (
        <OrderDetails
          borderColor={borderColor}
          order={order}
        />
      ) : null}
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          borderTop: isBelowMedium ? 'none' : `1px solid ${borderColor}`,
          padding: 2,
          borderRadius: isBelowMedium ? 'none' : BORDER_RADIUS,
          borderBottomLeftRadius: BORDER_RADIUS,
          borderBottomRightRadius: BORDER_RADIUS,
        }}>
        <Grid
          container
          spacing={2}>
          {order.orderItems.map((item, index) => {
            const numberOfItems = order.orderItems.length;
            const isFirstItem = index === 0;
            const isSecondItem = index === 1;
            const isSecondLastItem = numberOfItems - 2 === index;
            const isLastItem = numberOfItems - 1 === index;
            const imageUrl = item.product?.productImageData.find((image) => image.index === 0)?.imageUrl;

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
                      lg:
                        numberOfItems > 2 && !isLastItem && !isFirstItem && !isSecondItem && !isSecondLastItem ? 2 : 0,
                    },
                  }}>
                  <Grid
                    item
                    xs={4}
                    md={2}
                    lg={4}>
                    <OrderItemImage
                      orderItem={item}
                      imageUrl={imageUrl!}
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
    </Grid>
  );
}
