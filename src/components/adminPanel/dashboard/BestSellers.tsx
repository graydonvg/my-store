'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { BestSellersType } from '@/types';
import ProductCard from '@/components/product/productCard/ProductCard';
import { CONSTANTS } from '@/constants';
import CardTitle from './CardTitle';

function getPositionAndOrdinal(bestSellers: BestSellersType, index: number): [number, string] {
  const quantities = bestSellers.map((product) => product.totalQuantitySold);
  // Position is determined by index. Create a set to remove duplicates in case of a tie.
  const quantitiesSet = new Set(quantities);
  const quantitiesArray = Array.from(quantitiesSet);
  const position = quantitiesArray.indexOf(bestSellers[index].totalQuantitySold);
  let ordinal = '';

  if (position === 0) {
    ordinal = 'st';
  } else if (position === 1) {
    ordinal = 'nd';
  } else if (position === 2) {
    ordinal = 'rd';
  }

  return [position + 1, ordinal];
}

function getPositionWithOrdinal(bestSellers: BestSellersType, index: number) {
  const [position, ordinal] = getPositionAndOrdinal(bestSellers, index);

  return (
    <Typography
      component="h3"
      variant="h5">
      {position}
      <sup>{ordinal}</sup>
    </Typography>
  );
}

function getBorderColor(bestSellers: BestSellersType, index: number) {
  // Applies the same border color for tied products
  const bronze = 'rgba(205, 127, 50, 1)';
  const borderColors = ['gold', 'silver', bronze];
  const [position] = getPositionAndOrdinal(bestSellers, index);

  return position > 0 ? borderColors[position - 1] : '';
}

type Props = {
  bestSellers: BestSellersType | null;
};

export default function BestSellers({ bestSellers }: Props) {
  return (
    <Box
      sx={{
        height: 1,
        position: 'relative',
      }}>
      <CardTitle>Best sellers</CardTitle>

      {bestSellers && bestSellers.length > 0 ? (
        <Grid
          container
          spacing={2}>
          {bestSellers.map((product, index) => (
            <Grid
              item
              key={product.productId}
              xs={12}
              sm={4}
              sx={{
                borderRadius: CONSTANTS.BORDER_RADIUS,
                zIndex: 1,
              }}>
              <Paper
                elevation={8}
                sx={{ padding: 2, height: 1, border: `2px solid ${getBorderColor(bestSellers, index)}` }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 2,
                  }}>
                  {getPositionWithOrdinal(bestSellers, index)}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Typography variant="body1">Sold:</Typography>
                    <Box sx={{ display: 'flex', columnGap: 0.5 }}>
                      <Typography variant="body1">{product.totalQuantitySold ?? 'Data missing'}</Typography>
                      <Typography variant="body1">
                        {product.totalQuantitySold ? `unit${product.totalQuantitySold > 1 ? 's' : ''}` : null}
                      </Typography>
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
      ) : (
        <Box sx={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}>
          <Typography sx={{ fontSize: { xs: 24, sm: 32 } }}>No data</Typography>
        </Box>
      )}
    </Box>
  );
}
