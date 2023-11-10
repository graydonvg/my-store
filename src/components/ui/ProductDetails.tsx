'use client';

import { ProductType } from '@/types';
import { Box, Grid, Typography } from '@mui/material';
import ToggleButtons from './buttons/ToggleButtons';
import { formatCurrency, toggleButtonSizeOptions } from '@/lib/utils';
import CustomButton from './buttons/CustomButton';
import { AddShoppingCart } from '@mui/icons-material';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetImageData, setImageData, setImageUploadProgress } from '@/lib/redux/addProduct/addProductSlice';
import ProductImageBoxes from './productImageBoxes/ProductImageBoxes';

type Props = { product: ProductType };

export default function ProductDetails({ product }: Props) {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(resetImageData());
  //   product.product_image_data.map((data) => {
  //     dispatch(setImageData(data));
  //     dispatch(setImageUploadProgress({ file_name: data.file_name, progress: 100 }));
  //   });
  // }, [dispatch, product]);

  return (
    <Grid
      container
      spacing={4}>
      <Grid
        item
        xs={12}
        sm={6}>
        <ProductImageBoxes product={product} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          '&.MuiGrid-root': {
            paddingTop: { xs: 2, sm: 4 },
          },
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 4 } }}>
          <Typography
            component="h1"
            variant="h4"
            fontWeight={600}>
            {product.name}
          </Typography>
          <Typography
            component="span"
            variant="h5"
            fontWeight={600}>
            {formatCurrency(product.price)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              component="p"
              variant="body1"
              fontWeight={500}>
              Select A Size
            </Typography>
            <ToggleButtons
              buttons={toggleButtonSizeOptions}
              selection={['small']}
            />
          </Box>
          <CustomButton
            fullWidth
            label="add to cart"
            backgroundColor="blue"
            startIcon={<AddShoppingCart />}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              component="h2"
              variant="body1"
              fontWeight={500}>
              Shipping
            </Typography>
            <Typography
              component="p"
              variant="body1">
              {product.delivery_info}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              component="h2"
              variant="body1"
              fontWeight={500}>
              Description
            </Typography>
            <Typography
              component="p"
              variant="body1">
              {product.description}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
