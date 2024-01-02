import { Grid } from '@mui/material';
import ProductCard from './ui/ProductCard';
import { ProductType } from '@/types';

type Props = {
  show: boolean;
  products: ProductType[];
};

export default function Products({ show, products }: Props) {
  if (!show) return null;

  return (
    <Grid
      container
      spacing={{ xs: 2, sm: 3 }}>
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
