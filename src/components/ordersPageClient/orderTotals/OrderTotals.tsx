import useColorPalette from '@/hooks/useColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, useTheme } from '@mui/material';
import OrderTotalsRow from './OrderTotalsRow';

type OrderTotalsProps = {
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  totalToPay?: number;
};

export default function OrderTotals({
  orderTotal,
  discountTotal,
  deliveryFee,
  totalToPay,
  cartTotal,
}: OrderTotalsProps) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const discountTotalBackgroundColor = mode === 'dark' ? colorPalette.shade.dark : 'rgba(66, 165, 245, 0.09)';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <OrderTotalsRow
        label="Cart total"
        price={formatCurrency(cartTotal)}
        fontSize={14}
      />

      {discountTotal > 0 ? (
        <OrderTotalsRow
          label="Discount total"
          price={`-${formatCurrency(discountTotal)}`}
          fontSize={14}
          fontWeight={600}
          backgroundColor={discountTotalBackgroundColor}
        />
      ) : null}

      <Box
        sx={{
          borderBottom: !totalToPay ? `2px solid ${colorPalette.border}` : 'none',
          marginBottom: !totalToPay ? 1 : 0,
        }}>
        <OrderTotalsRow
          label="Delivery fee"
          price={orderTotal > 0 ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : formatCurrency(0)}
          fontSize={14}
        />
      </Box>

      {totalToPay ? (
        <Box
          sx={{
            marginBottom: 1,
            borderTop: `1px solid ${colorPalette.border}`,
            borderBottom: `2px solid ${colorPalette.border}`,
          }}>
          <OrderTotalsRow
            label="Order total"
            price={formatCurrency(orderTotal)}
            fontSize={14}
            fontWeight={600}
          />
        </Box>
      ) : null}

      <OrderTotalsRow
        label={(totalToPay ? 'Total to pay' : 'Order total').toUpperCase()}
        price={formatCurrency(totalToPay ? totalToPay : orderTotal)}
        fontSize={18}
        fontWeight={700}
      />
    </Box>
  );
}
