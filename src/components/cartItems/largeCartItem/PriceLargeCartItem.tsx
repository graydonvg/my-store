import useColorPalette from '@/hooks/useColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, Typography } from '@mui/material';

type Props = {
  isOnSale: boolean;
  price: number;
  discountedPrice: number;
};

export default function PriceLargeCartItem({ isOnSale, price, discountedPrice }: Props) {
  const colorPalette = useColorPalette();

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
          color={colorPalette.typographyVariants.grey}
          sx={{ textDecoration: 'line-through' }}>
          {formatCurrency(price)}
        </Typography>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={{ xs: 20, sm: 24 }}
        fontWeight={700}>
        {formatCurrency(isOnSale ? discountedPrice : price)}
      </Typography>
    </Box>
  );
}
