import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

type ProductsProps = {};

export default function Products() {
  return (
    <Grid
      container
      spacing={8}>
      <ProductCard />
    </Grid>
  );
}
