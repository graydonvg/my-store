'use client';

import { Grid } from '@mui/material';
import ProductCard from './ui/ProductCard';

type ProductsProps = {};

export default function Products() {
  return (
    <Grid
      container
      spacing={2}>
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </Grid>
  );
}
