import { Box, Grid, Skeleton } from '@mui/material';
import ProductCard from './productCard/ProductCard';
import { Product } from '@/types';

import { CONSTANTS } from '@/constants';

type Props = {
  products: Product[];
};

export default function Products({ products }: Props) {
  return (
    <Grid
      component="ul"
      container
      spacing={{ xs: 2, md: 3 }}>
      {products.map((product) => (
        <Grid
          component="li"
          key={product.productId}
          item
          xs={6}
          md={4}
          lg={3}>
          <ProductCard
            product={product}
            imageSizes="(min-width: 1200px) 204px, (min-width: 900px) calc(33.21vw - 119px), calc(48.62vw - 20px)"
          />
        </Grid>
      ))}
    </Grid>
  );
}

export function ProductsSkeleton() {
  return (
    <Grid
      component="ul"
      container
      spacing={{ xs: 2, md: 3 }}>
      {Array.from(Array(6)).map((_, index) => (
        <Grid
          component="li"
          key={index}
          item
          xs={6}
          md={4}
          lg={3}>
          <Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ aspectRatio: 25 / 36, borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
            <Box sx={{ paddingY: 1 }}>
              <Skeleton variant="text" />
              <Skeleton
                variant="text"
                width="50%"
              />
              <Skeleton variant="text" />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
