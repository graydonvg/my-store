'use client';

import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, Typography, useTheme } from '@mui/material';

type TotalProps = {
  label: string;
  price: string;
  fontSize: number;
  fontWeight?: number;
  backgroundColor?: string;
};

function Total({ label, price, fontSize, fontWeight, backgroundColor }: TotalProps) {
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

type Props = {
  cartTotal: number;
  discountTotal: number;
  deliveryFee: number;
  orderTotal: number;
  totalToPay?: number;
};

export default function OrderTotals({ orderTotal, discountTotal, deliveryFee, totalToPay, cartTotal }: Props) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor =
    mode === 'dark' ? customColorPalette.white.opacity.lightest : customColorPalette.black.opacity.lightest;
  const discountTotalBackgroundColor = mode === 'dark' ? customColorPalette.grey.medium : customColorPalette.grey.light;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Total
        label="Cart total"
        price={formatCurrency(cartTotal)}
        fontSize={14}
      />
      {discountTotal > 0 ? (
        <Total
          label="Discount total"
          price={`-${formatCurrency(discountTotal)}`}
          fontSize={14}
          fontWeight={600}
          backgroundColor={discountTotalBackgroundColor}
        />
      ) : null}
      <Box
        sx={{
          borderBottom: !totalToPay ? `2px solid ${borderColor}` : 'none',
          marginBottom: !totalToPay ? 1 : 0,
        }}>
        <Total
          label="Delivery fee"
          price={orderTotal > 0 ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : formatCurrency(0)}
          fontSize={14}
        />
      </Box>
      {!!totalToPay ? (
        <Box sx={{ marginBottom: 1, borderTop: `1px solid ${borderColor}`, borderBottom: `2px solid ${borderColor}` }}>
          <Total
            label="Order total"
            price={formatCurrency(orderTotal)}
            fontSize={14}
            fontWeight={600}
          />
        </Box>
      ) : null}
      <Total
        label={totalToPay ? 'TOTAL TO PAY' : 'ORDER TOTAL'}
        price={formatCurrency(totalToPay ? totalToPay : orderTotal)}
        fontSize={18}
        fontWeight={700}
      />
    </Box>
  );
}
