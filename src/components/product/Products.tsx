import { Grid } from '@mui/material';
import ProductCard from './productCard/ProductCard';
import { Product } from '@/types';

type Props = {
  products: Product[] | null;
};

export default function Products({ products }: Props) {
  return (
    <Grid
      component="ul"
      container
      spacing={{ xs: 2, md: 3 }}>
      {products?.map((product, index) => (
        <Grid
          component="li"
          key={index}
          item
          xs={6}
          sm={3}
          lg={2}>
          <ProductCard
            product={product}
            imageSizes="(min-width: 1200px) 172px, (min-width: 600px) calc(25vw - 27px), calc(50vw - 24px)"
          />
        </Grid>
      ))}
    </Grid>
  );
}
