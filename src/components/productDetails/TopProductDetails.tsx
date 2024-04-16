import { Box, Typography } from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import { ProductType } from '@/types';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';

type Props = {
  product: ProductType;
};

export default function TopProductDetails({ product }: Props) {
  const isOnSale = product.isOnSale === 'Yes';
  const discountedPrice = calculateDiscountedProductPrice(product);

  return (
    <>
      <Box>
        <Typography
          sx={{ paddingY: 1 }}
          lineHeight={1.2}
          component="h1"
          fontSize={30}>
          {product.name}
        </Typography>
        <Typography
          lineHeight={1}
          component="span"
          fontSize={16}
          sx={{ paddingY: 1, color: (theme) => theme.palette.custom }}>
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
          fontFamily={'Georgia'}
          fontStyle="italic"
          fontSize={42}>
          {formatCurrency(isOnSale ? discountedPrice : product.price)}
        </Typography>
        {isOnSale ? (
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
              fontFamily={'Georgia'}
              fontStyle="italic"
              fontSize={22}
              sx={{ textDecoration: 'line-through', paddingRight: 1, color: (theme) => theme.palette.custom }}>
              {formatCurrency(product.price)}
            </Typography>
            <Typography
              lineHeight={1}
              component="span"
              fontSize={22}
              fontFamily={'Georgia'}
              fontStyle="italic"
              sx={{ color: (theme) => theme.palette.custom.primary.light, fontFamily: 'serif' }}>
              {`-${product.salePercentage}%`}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
