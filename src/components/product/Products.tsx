import { Grid } from '@mui/material';
import ProductCard from './productCard/ProductCard';
import { Product } from '@/types';

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
