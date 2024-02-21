import { Box, Typography } from '@mui/material';
import { formatCurrency } from '@/utils/formatCurrency';
import { ProductType } from '@/types';
import useColorPalette from '@/hooks/useColorPalette';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';

type Props = {
  product: ProductType;
};

export default function TopProductDetails({ product }: Props) {
  const colorPalette = useColorPalette();
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
          sx={{ paddingY: 1 }}
          lineHeight={1}
          component="span"
          fontSize={16}
          color={colorPalette.typographyVariants.grey}>
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
              color={colorPalette.typographyVariants.grey}
              sx={{ textDecoration: 'line-through', paddingRight: 1 }}>
              {formatCurrency(product.price)}
            </Typography>
            <Typography
              lineHeight={1}
              component="span"
              fontSize={22}
              fontFamily={'Georgia'}
              fontStyle="italic"
              sx={{ color: colorPalette.primary.light, fontFamily: 'serif' }}>
              {`-${product.salePercentage}%`}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
