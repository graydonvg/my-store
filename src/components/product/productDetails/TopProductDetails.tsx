'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { formatCurrency } from '@/utils/formatting';
import { Product } from '@/types';
import { calculateRoundedDiscountedPrice } from '@/utils/calculations';

type Props = {
  product: Product;
};

export default function TopProductDetails({ product }: Props) {
  const theme = useTheme();
  const roundedDiscountedPrice = calculateRoundedDiscountedPrice(product.price, product.salePercentage);

  return (
    <>
      <Box>
        <Typography
          lineHeight={1.2}
          component="h1"
          fontSize={30}
          sx={{ paddingY: 1, color: theme.palette.text.primary }}>
          {product.name}
        </Typography>
        <Typography
          lineHeight={1}
          component="span"
          fontSize={16}
          sx={{ paddingY: 1, color: theme.palette.text.secondary }}>
          {product.brand.toUpperCase()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 1,
          columnGap: 2,
        }}>
        <Typography
          lineHeight={1}
          component="span"
          fontFamily="Georgia"
          fontStyle="italic"
          fontSize={42}
          sx={{ color: theme.palette.text.primary }}>
          {formatCurrency(product.isOnSale ? roundedDiscountedPrice : product.price)}
        </Typography>
        {product.isOnSale ? (
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'flex-end',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}>
            <Typography
              lineHeight={1.3}
              component="span"
              fontFamily="Georgia"
              fontStyle="italic"
              fontSize={22}
              sx={{ textDecoration: 'line-through', paddingRight: 1, color: theme.palette.text.disabled }}>
              {formatCurrency(product.price)}
            </Typography>
            <Typography
              lineHeight={1}
              component="span"
              fontSize={22}
              fontFamily="Georgia"
              fontStyle="italic"
              sx={{ color: theme.palette.primary.light, fontFamily: 'serif' }}>
              {`-${product.salePercentage}%`}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
