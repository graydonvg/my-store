'use client';

import { ProductType } from '@/types';
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material';
import ToggleButtons from './ui/buttons/ToggleButtons';
import { formatCurrency, toggleButtonSizeOptions } from '@/lib/utils';
import CustomButton from './ui/buttons/CustomButton';
import { Add, AddShoppingCart, Favorite, Remove } from '@mui/icons-material';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { MouseEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addItemToCart } from '@/lib/redux/cart/cartSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';

type Props = { product: ProductType };

export default function ProductDetails({ product }: Props) {
  const color = useCustomColorPalette();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const size = searchParams.get('size');
  const quantity = Number(searchParams.get('quantity'));
  const initialQuantity = quantity !== 0 ? quantity : 1;
  const [itemQuantity, setItemQuantity] = useState(initialQuantity);
  const [itemSize, setItemSize] = useState<string | null>(size);
  const isOnSale = product.on_sale === 'Yes';
  const salePrice = product.price - (product.price as number) * ((product.sale_percentage as number) / 100);

  function getToggleButtonOptions() {
    return product.sizes.map((size) => toggleButtonSizeOptions.filter((option) => option.value === size)[0]);
  }

  function handleSelectSize(e: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setItemSize((prevSize) => (prevSize !== selectedSize ? selectedSize : null));

    const currentUrl = new URL(window.location.href);

    if (size !== selectedSize) {
      currentUrl.searchParams.set('size', selectedSize);
    } else {
      currentUrl.searchParams.delete('size');
      currentUrl.searchParams.delete('quantity');
    }

    router.replace(currentUrl.toString(), {
      scroll: false,
    });
  }

  function handleOpenSignInModal() {
    dispatch(setModalContent('signIn'));
    dispatch(setIsModalOpen(true));
  }

  function handleSelectSizeToast() {
    toast.warning('Please select a size.');
  }

  function handleAddToCart() {
    if (!currentUser) {
      handleOpenSignInModal();
      return;
    }

    if (!itemSize) {
      handleSelectSizeToast();
      return;
    }

    dispatch(
      addItemToCart({
        productId: product.product_id,
        name: product.name,
        imageUrl: product.product_image_data[0].image_url,
        price: product.price,
        salePrice: salePrice,
        quantity: itemQuantity,
        size: itemSize,
      })
    );

    setItemQuantity(1);
  }

  function handleAddToWishlist() {
    if (!currentUser) {
      handleOpenSignInModal();
      return;
    }

    if (!itemSize) {
      handleSelectSizeToast();
      return;
    }

    // dispatch(
    //   addItemToCart({
    //     productId: product.product_id,
    //     name: product.name,
    //     imageUrl: product.product_image_data[0].image_url,
    //     price: product.price,
    //     salePrice: salePrice,
    //     size,
    //   })
    // );
  }

  function handleIncrementItemQuantity() {
    setItemQuantity((prevQuantity) => prevQuantity + 1);

    const currentUrl = new URL(window.location.href);

    const updatedQuantity = initialQuantity + 1;

    currentUrl.searchParams.set('quantity', updatedQuantity.toString());

    router.replace(currentUrl.toString(), {
      scroll: false,
    });
  }

  function handleDecrementItemQuantity() {
    setItemQuantity((prevQuantity) => (prevQuantity !== 1 ? prevQuantity - 1 : 1));

    const currentUrl = new URL(window.location.href);

    const updatedQuantity = initialQuantity - 1;

    if (updatedQuantity !== 0) {
      currentUrl.searchParams.set('quantity', updatedQuantity.toString());
    }

    router.replace(currentUrl.toString(), {
      scroll: false,
    });
  }

  return (
    <Grid
      container
      spacing={{ xs: 0, md: 4 }}>
      <Grid
        item
        xs={12}
        md={6}>
        <ProductImageBoxes product={product} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          '&.MuiGrid-root': {
            paddingTop: { xs: 2, sm: 4 },
            paddingX: { xs: 1, md: 4 },
            paddingRight: { md: 0 },
          },
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: 2,
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
                alignItems: { sm: 'flex-end' },
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'row' },
              }}>
              <Typography
                sx={{ paddingRight: 2 }}
                component="span"
                variant="h4"
                fontWeight={500}>
                {formatCurrency(isOnSale ? salePrice : product.price)}
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
                    sx={{ textDecoration: 'line-through', opacity: '50%', paddingRight: 1 }}
                    fontWeight={400}>
                    {formatCurrency(product.price)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{ color: color.blue.light, fontFamily: 'serif' }}>
                    {`-${product.sale_percentage}%`}
                  </Typography>
                </Box>
              ) : null}
            </Box>
            <Divider />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              paddingBottom: 2,
            }}>
            <Typography
              component="p"
              variant="body1"
              fontWeight={500}
              sx={{ textTransform: 'uppercase' }}>
              Select A Size
            </Typography>
            <ToggleButtons
              onChange={handleSelectSize}
              buttons={getToggleButtonOptions()}
              selection={itemSize ? [itemSize] : []}
            />
          </Box>
          {itemSize ? (
            <>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Typography
                  component="p"
                  variant="body1"
                  fontWeight={500}
                  sx={{ textTransform: 'uppercase' }}>
                  Quantity
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '320px',
                    flexShrink: 1,
                  }}>
                  <IconButton
                    onClick={handleDecrementItemQuantity}
                    sx={{
                      color: 'inherit',
                      height: '56px',
                      aspectRatio: 3 / 2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}>
                    <Remove />
                  </IconButton>
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{ width: '4ch', textAlign: 'center' }}>
                    {itemQuantity}
                  </Typography>
                  <IconButton
                    onClick={handleIncrementItemQuantity}
                    sx={{
                      color: 'inherit',
                      height: '56px',
                      aspectRatio: 3 / 2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              paddingY: 4,
            }}>
            <CustomButton
              onClick={handleAddToCart}
              fullWidth
              label="add to cart"
              backgroundColor="blue"
              startIcon={<AddShoppingCart />}
            />
            <CustomButton
              onClick={handleAddToWishlist}
              fullWidth
              label="add to wishlist"
              backgroundColor="red"
              startIcon={<Favorite />}
            />
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
