import { roundAndFormatCurrency } from '@/utils/formatCurrency';
import { Box, Typography } from '@mui/material';

type Props = {
  isOnSale: boolean;
  price: number;
  discountedPrice: number;
};

export default function SmallCartItemPrice({ isOnSale, price, discountedPrice }: Props) {
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
            {roundAndFormatCurrency(price)}
          </Typography>
        </Box>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={16}
        fontWeight={700}>
        {roundAndFormatCurrency(isOnSale ? discountedPrice : price)}
      </Typography>
    </Box>
  );
}
