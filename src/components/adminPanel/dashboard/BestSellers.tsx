'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { Product } from '@/types';
import ProductCard from '@/components/product/productCard/ProductCard';
import { constants } from '@/constants';
import CardTitle from './CardTitle';

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getClassName(bestSellers: Array<Product & { totalQuantitySold: number | null }>, index: number) {
  const mostSoldQuantity = bestSellers.length > 0 ? bestSellers[0].totalQuantitySold : null;
  const secondMostSoldQuantity = bestSellers.length > 1 ? bestSellers[1].totalQuantitySold : null;
  const thirdMostSoldQuantity = bestSellers.length > 2 ? bestSellers[2].totalQuantitySold : null;

  if (mostSoldQuantity !== null && bestSellers[index].totalQuantitySold === mostSoldQuantity) {
    return 'animated-card-first';
  } else if (secondMostSoldQuantity !== null && bestSellers[index].totalQuantitySold === secondMostSoldQuantity) {
    return 'animated-card-second';
  } else if (thirdMostSoldQuantity !== null && bestSellers[index].totalQuantitySold === thirdMostSoldQuantity) {
    return 'animated-card-third';
  } else {
    return '';
  }
}

type Props = {
  bestSellers: Array<Product & { totalQuantitySold: number | null }>;
};

export default function BestSellers({ bestSellers }: Props) {
  return (
    <>
      <CardTitle>Best sellers</CardTitle>
      <Grid
        container
        spacing={2}>
        {bestSellers?.map((product, index) => (
          <Grid
            item
            key={product.productId}
            xs={12}
            sm={4}
            sx={{
              borderRadius: constants.borderRadius,
              zIndex: 1,
            }}>
            <Paper
              elevation={8}
              className={`animated-card ${getClassName(bestSellers, index)}`}
              sx={{ padding: 2, height: 1, position: 'relative' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 2,
                }}>
                <Typography
                  component="h3"
                  variant="h5">
                  {index + 1}
                  <sup>{getOrdinal(index + 1)}</sup>
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Typography variant="body1">Sold:</Typography>
                  <Box sx={{ display: 'flex', columnGap: 0.5 }}>
                    <Typography variant="body1">{product.totalQuantitySold ?? 'Data missing'}</Typography>
                    <Typography variant="body1">{product.totalQuantitySold ? 'units' : null}</Typography>
                  </Box>
                </Box>
              </Box>

              <ProductCard
                product={product}
                imageSizes="(min-width: 2040px) 11.2vw, (min-width: 1920px) 207px, (min-width: 1536px) 190px, (min-width: 1200px) 414px, (min-width: 600px) 303px, 490px"
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
