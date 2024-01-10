import { OrderType } from '@/types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from './OrderTotals';
import { borderRadius } from '@/constants/styles';

type AddressFieldProps = {
  label: string;
  value: string | number | null;
};

function AddressField({ label, value }: AddressFieldProps) {
  return (
    <Typography
      id={label}
      component="h3"
      fontSize={14}>
      {value}
    </Typography>
  );
}

type Props = {
  show: boolean;
  order: OrderType;
  borderColor: string;
};

export default function OrderDetails({ show, order, borderColor }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const shippingDetails = { ...order.shippingDetails[0] };

  if (!show) return null;

  return (
    <Grid
      item
      xs={0}
      md={3}>
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          padding: 2,
          borderRadius: isBelowMedium ? 'none' : borderRadius,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                Order Status:
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {order.isPaid === true ? 'Paid' : 'Payment pending'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                Order Date:
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {order.createdAt.split('T')[0]}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Typography
              component="h4"
              fontSize={14}
              fontWeight={500}
              textTransform="uppercase">
              Shipping Details:
            </Typography>
            <Box>
              <AddressField
                label="Full Name"
                value={`${shippingDetails.recipientFirstName} ${shippingDetails.recipientLastName}`}
              />
              <AddressField
                label="Contact Number"
                value={shippingDetails.recipientContactNumber}
              />
              <AddressField
                label="Complex or Building"
                value={shippingDetails.complexOrBuilding}
              />
              <AddressField
                label="Street Address"
                value={shippingDetails.streetAddress}
              />
              <AddressField
                label="Suburb"
                value={shippingDetails.suburb}
              />
              <AddressField
                label="Province"
                value={shippingDetails.province}
              />
              <AddressField
                label="City"
                value={shippingDetails.city}
              />
              <AddressField
                label="Postal Code"
                value={shippingDetails.postalCode}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              component="h3"
              fontSize={18}
              fontWeight={600}>
              Order Summary
            </Typography>
            <OrderTotals
              cartTotal={order.cartTotal}
              discountTotal={order.discountTotal}
              deliveryFee={order.deliveryFee}
              orderTotal={order.orderTotal}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
