import { formatCurrency } from '@/utils/format';
import { Box, Typography } from '@mui/material';

type Props = {
  totalStandardPrice: number;
  totalDiscountedPrice: number;
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
            color={(theme) => theme.palette.text.disabled}
            sx={{ textDecoration: 'line-through' }}>
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
        {formatCurrency(isOnSale ? totalDiscountedPrice : totalStandardPrice)}
      </Typography>
    </Box>
  );
}
