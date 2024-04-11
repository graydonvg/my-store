'use client';

import { ProductType } from '@/types';
import { Box, Divider, Grid } from '@mui/material';
import ProductImageBoxes from '../ui/productImageBoxes/ProductImageBoxes';
import ProductSelectionOptions from './productSelectionOptions/ProductSelectionOptions';
import BottomProductDetails from './bottomProductDetails/BottomProductDetails';
import TopProductDetails from './TopProductDetails';
import { useEffect } from 'react';
import { resetProductSelectionDetails } from '@/lib/redux/slices/productSelectionDetailsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

type Props = {
  product: ProductType;
};

export default function ProductDetails({ product }: Props) {
  const dispatch = useAppDispatch();
  const size = useAppSelector((state) => state.productSelectionDetails.size);

  useEffect(() => {
    if (size === null) return;

    dispatch(resetProductSelectionDetails());
  }, [dispatch, size]);

  return (
    <Grid
      container
      columnSpacing={4}
      rowSpacing={2}
      sx={{ height: 1 }}>
      <Grid
        item
        xs={12}
        md={6}>
        <ProductImageBoxes product={product} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: 2,
            }}>
            <TopProductDetails product={product} />
            <Divider />
          </Box>
          <ProductSelectionOptions product={product} />
          <Divider />
          <BottomProductDetails product={product} />
        </Box>
      </Grid>
    </Grid>
  );
}
