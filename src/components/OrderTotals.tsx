'use client';

import { borderRadius } from '@/constants/styles';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, Divider, Typography, useTheme } from '@mui/material';

type Props = {
  cartTotal: number;
  totalDiscount: number;
  deliveryFee: number;
  orderTotal: number;
  totalToPay?: number;
};

export default function OrderTotals({ orderTotal, totalDiscount, deliveryFee, totalToPay, cartTotal }: Props) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const dividerColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';

  function renderOrderTotals({
    label,
    price,
    fontSize,
    fontWeight,
    backgroundColor,
  }: {
    label: string;
    price: string;
    fontSize: number;
    fontWeight?: number;
    backgroundColor?: string;
  }) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 1,
          padding: 1,
          backgroundColor,
          borderRadius: borderRadius,
        }}>
        <Typography
          paddingRight={2}
          component="span"
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {label}
        </Typography>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography
            component="span"
            fontSize={fontSize}
            fontWeight={fontWeight}>
            {price}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 2 }}>
      {renderOrderTotals({
        label: 'Cart total',
        price: formatCurrency(cartTotal),
        fontSize: 14,
      })}
      {totalDiscount > 0
        ? renderOrderTotals({
            label: 'Discount total',
            price: `-${formatCurrency(totalDiscount)}`,
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#42a5f517',
          })
        : null}
      {renderOrderTotals({
        label: 'Delivery fee',
        price: orderTotal > 0 ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : formatCurrency(0),
        fontSize: 14,
      })}
      <Divider />
      {totalToPay
        ? renderOrderTotals({
            label: 'Order total',
            price: formatCurrency(orderTotal),
            fontSize: 14,
            fontWeight: 600,
          })
        : null}
      <Divider sx={{ border: `1.5px solid ${dividerColor}` }} />
      {renderOrderTotals({
        label: totalToPay ? 'TOTAL TO PAY' : 'ORDER TOTAL',
        price: formatCurrency(totalToPay ? totalToPay : orderTotal),
        fontSize: 18,
        fontWeight: 700,
      })}
    </Box>
  );
}
