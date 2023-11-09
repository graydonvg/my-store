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
      spacing={{ xs: 0.3, sm: 2 }}>
      {products.map((product, index) => (
        <Grid
          key={index}
          item
          xs={6}
          md={4}
          lg={3}
          xl={2}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
