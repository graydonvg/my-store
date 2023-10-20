'use client';

import { Box, Grid, Typography } from '@mui/material';
import ProductCard from './ui/ProductCard';
import { ProductDataType } from '@/types';
import { Fragment } from 'react';

type ProductsProps = {
  categoriesAndProducts: {
    title: string;
    products: ProductDataType[];
  }[];
};

export default function Products({ categoriesAndProducts }: ProductsProps) {
  return (
    <Grid
      container
      spacing={4}>
      {categoriesAndProducts?.map((category) => {
        return (
          <Grid
            xs={12}
            item
            key={category.title}>
            <Typography
              sx={{ textAlign: 'center', paddingBottom: 2 }}
              component="h2"
              variant="h5">
              {category.title}
            </Typography>
            <Grid
              container
              spacing={1}>
              {category.products
                .slice()
                .reverse()
                .map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                  />
                ))}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
