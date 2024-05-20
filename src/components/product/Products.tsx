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
            imageSizes="532px"
          />
        </Grid>
      ))}
    </Grid>
  );
}
