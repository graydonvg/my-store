'use client';

import { ProductType } from '@/types';
import { Box, Divider, Grid, Typography } from '@mui/material';
import ToggleButtons from './ui/buttons/ToggleButtons';
import { formatCurrency, toggleButtonSizeOptions } from '@/lib/utils';
import CustomButton from './ui/buttons/CustomButton';
import { AddShoppingCart, Favorite, HeartBroken } from '@mui/icons-material';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { MouseEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type Props = { product: ProductType };

export default function ProductDetails({ product }: Props) {
  const color = useCustomColorPalette();
  const searchParams = useSearchParams();
  const router = useRouter();
  const size = searchParams.get('size');
  const isOnSale = product.on_sale === 'Yes';
  const sale_price = product.price - (product.price as number) * ((product.sale_percentage as number) / 100);

  function getToggleButtonOptions() {
    return product.sizes.map((size) => toggleButtonSizeOptions.filter((option) => option.value === size)[0]);
  }

  function handleSelectSize(e: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    const currentUrl = new URL(window.location.href);

    if (size !== selectedSize) {
      currentUrl.searchParams.set('size', selectedSize);
    } else {
      currentUrl.searchParams.delete('size');
    }

    router.replace(currentUrl.toString(), {
      scroll: false,
    });
  }

  function handleAddToCart() {
    if (!size) return toast.warning('Please select a size.');
    console.log({
      product_id: product.product_id,
      name: product.name,
      image_url: product.product_image_data[0].image_url,
      price: product.price,
      sale_price,
      size,
    });
  }

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
        <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: { xs: 1, sm: 2 },
            }}>
            <Typography
              component="h1"
              variant="h4"
              fontWeight={400}>
              {product.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
              }}>
              <Typography
                sx={{ paddingRight: 2 }}
                component="span"
                variant="h4"
                fontWeight={600}>
                {formatCurrency(isOnSale ? sale_price : product.price)}
              </Typography>
              {isOnSale ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexWrap: 'nowrap',
                  }}>
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{ textDecoration: 'line-through', opacity: '70%', paddingRight: 1 }}
                    fontWeight={500}>
                    {formatCurrency(product.price)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{ color: color.blue.light }}
                    fontWeight={500}>
                    {`-${product.sale_percentage}%`}
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingTop: { xs: 1, sm: 2 },
              paddingBottom: { xs: 2, sm: 4 },
            }}>
            <Typography
              component="p"
              variant="body1"
              fontWeight={500}>
              Select A Size
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
              <ToggleButtons
                onChange={handleSelectSize}
                buttons={getToggleButtonOptions()}
                selection={size ? [size] : []}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                }}>
                <CustomButton
                  onClick={handleAddToCart}
                  fullWidth
                  label="add to cart"
                  backgroundColor="blue"
                  startIcon={<AddShoppingCart />}
                />
                <CustomButton
                  onClick={handleAddToCart}
                  fullWidth
                  label="add to wishlist"
                  backgroundColor="red"
                  startIcon={<Favorite />}
                />
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingY: { xs: 1, sm: 2 },
            }}>
            <Typography
              component="h2"
              variant="body1"
              fontWeight={500}
              sx={{ opacity: '70%' }}>
              Shipping
            </Typography>
            <Typography
              component="p"
              variant="body1">
              {product.delivery_info}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingY: { xs: 1, sm: 2 } }}>
            <Typography
              component="h2"
              variant="body1"
              fontWeight={500}
              sx={{ opacity: '70%' }}>
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
