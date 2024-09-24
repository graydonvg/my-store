import { formatCurrency } from '@/utils/formatting';
import { Box, Typography } from '@mui/material';

type Props = {
  totalStandardPrice: number;
  totalDiscountedPrice: number | null;
  isOnSale: boolean;
};

export default function SmallCartItemPrice({ totalStandardPrice, totalDiscountedPrice, isOnSale }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        width: 1,
      }}>
      {isOnSale ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}>
          <Typography
            lineHeight={1}
            component="span"
            fontSize={16}
            fontWeight={700}
            sx={{ color: (theme) => theme.palette.text.disabled, textDecoration: 'line-through' }}>
            {formatCurrency(totalStandardPrice)}
          </Typography>
        </Box>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={16}
        fontWeight={700}>
        {formatCurrency(isOnSale ? totalDiscountedPrice! : totalStandardPrice)}
      </Typography>
    </Box>
  );
}
