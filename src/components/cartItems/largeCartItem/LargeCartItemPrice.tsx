import { formatCurrency } from '@/utils/formatting';
import { Box, Typography } from '@mui/material';

type Props = {
  totalStandardPrice: number;
  totalDiscountedPrice: number | null;
  isOnSale: boolean;
};

export default function LargeCartItemPrice({ totalStandardPrice, totalDiscountedPrice, isOnSale }: Props) {
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
          sx={{ color: (theme) => theme.palette.text.disabled, textDecoration: 'line-through' }}>
          {formatCurrency(totalStandardPrice)}
        </Typography>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={{ xs: 20, sm: 24 }}
        fontWeight={700}>
        {formatCurrency(isOnSale ? totalDiscountedPrice! : totalStandardPrice)}
      </Typography>
    </Box>
  );
}
