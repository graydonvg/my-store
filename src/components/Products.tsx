import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './ui/ProductCard';
import { Fragment } from 'react';
import { Database } from '@/lib/database.types';
import { categories } from '@/lib/utils';

type Props = {
  products: Database['public']['Tables']['products']['Row'][];
};

export default function Products({ products }: Props) {
  return (
    <Grid
      container
      spacing={4}>
      {categories?.map((category) => {
        return (
          <Grid
            xs={12}
            item
            key={category}>
            <Typography
              sx={{ textAlign: 'center', paddingBottom: 2 }}
              component="h2"
              variant="h5">
              {category}
            </Typography>
            <Grid
              container
              spacing={1}>
              {products
                .slice()
                .reverse()
                .map((product, index) => {
                  return product.category === category ? (
                    <ProductCard
                      key={index}
                      product={product}
                    />
                  ) : null;
                })}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
