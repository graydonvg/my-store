import { Grid } from '@mui/material';
import ProductCard from './ui/ProductCard';
import { ProductType } from '@/types';

type Props = {
  products: ProductType[];
};

export default function Products({ products }: Props) {
  return (
    <Grid
      container
      spacing={{ xs: 0.25, sm: 2 }}>
      {products.map((product, index) => (
        <Grid
          key={index}
          item
          xs={6}
          sm={3}
          lg={2}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
