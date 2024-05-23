import { calculateRoundedDiscountedPrice } from '@/utils/calculate';
import { formatCurrency } from '@/utils/format';
import { Box, Typography } from '@mui/material';

type Props = {
  isOnSale: boolean;
  price: number;
  salePercentage: number;
  quantity: number;
};

export default function LargeCartItemPrice({ isOnSale, price, salePercentage, quantity }: Props) {
  const roundedDiscountedPrice = calculateRoundedDiscountedPrice(price, salePercentage);
  const totalPrice = price * quantity;
  const totalDiscountedPrice = roundedDiscountedPrice * quantity;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}>
      {isOnSale ? (
        <Typography
          lineHeight={1}
          component="span"
          fontSize={{ xs: 20, sm: 24 }}
          fontWeight={400}
          color={(theme) => theme.palette.text.disabled}
          sx={{ textDecoration: 'line-through' }}>
          {formatCurrency(totalPrice)}
        </Typography>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={{ xs: 20, sm: 24 }}
        fontWeight={700}>
        {formatCurrency(isOnSale ? totalDiscountedPrice : totalPrice)}
      </Typography>
    </Box>
  );
}
