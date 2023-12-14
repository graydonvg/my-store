'use client';

import { ProductType } from '@/types';
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material';
import ToggleButtons from './ui/buttons/ToggleButtons';
import { calculateDiscountedPrice, formatCurrency, toggleButtonSizeOptions } from '@/lib/utils';
import ContainedButton from './ui/buttons/ContainedButton';
import { Add, AddShoppingCart, Favorite, LocalShippingOutlined, Remove } from '@mui/icons-material';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import addProductToCart from '@/services/cart/add-product-to-cart';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import { setIsSignInDialogOpen } from '@/lib/redux/dialog/dialogSlice';

type Props = { product: ProductType };

export default function ProductDetails({ product }: Props) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useAppDispatch();
  const supabase = createSupabaseBrowserClient();
  const customColorPalette = useCustomColorPalette();
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemSize, setItemSize] = useState<string | null>(null);
  const isOnSale = product.on_sale === 'Yes';
  const discountedPrice = calculateDiscountedPrice(product);

  function sortSizesArray(a: { label: string; value: string }, b: { label: string; value: string }) {
    const indexOfA = toggleButtonSizeOptions.indexOf(a);
    const indexOfB = toggleButtonSizeOptions.indexOf(b);

    if (indexOfA !== -1 && indexOfB !== -1) {
      return indexOfA - indexOfB;
    } else if (indexOfA !== -1) {
      return -1;
    } else if (indexOfB !== -1) {
      return 1;
    } else {
      return 0;
    }
  }

  function getToggleButtonOptions() {
    const availableSizes = product.sizes.map(
      (size) => toggleButtonSizeOptions.filter((option) => option.value === size)[0]
    );

    return availableSizes.sort(sortSizesArray);
  }

  function handleSelectSize(e: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setItemSize((prevSize) => (prevSize !== selectedSize ? selectedSize : null));
  }

  function handleOpenSignInDialog() {
    dispatch(setIsSignInDialogOpen(true));
  }

  function handleSelectSizeToast() {
    toast.info('Please select a size.');
  }

  async function handleAddToCart() {
    if (!currentUser) {
      handleOpenSignInDialog();
      return;
    }

    if (!itemSize) {
      handleSelectSizeToast();
      return;
    }

    setIsAddingToCart(true);

    const itemExists = cartItems.find((item) => item?.product?.product_id === product.product_id);

    try {
      if (itemExists && itemExists.size === itemSize) {
        const { error } = await supabase.rpc('update', {
          item_id: itemExists.cart_item_id,
          item_quantity: itemQuantity,
        });

        if (!error) {
          router.refresh();
          setItemQuantity(1);
        } else {
          toast.error(error.message);
        }
      } else {
        const { success, message } = await addProductToCart({
          product_id: product.product_id,
          quantity: itemQuantity,
          size: itemSize,
          user_id: currentUser?.user_id,
        });

        if (success === false) {
          toast.error(message);
        } else {
          router.refresh();
          setItemQuantity(1);
        }
      }
    } catch (error) {
      toast.error(`Failed to add product to cart. Please try again later.`);
    } finally {
      setIsAddingToCart(false);
    }
  }

  function handleAddToWishlist() {
    // check if item already added!!!

    if (!currentUser) {
      handleOpenSignInDialog();
      return;
    }

    if (!itemSize) {
      handleSelectSizeToast();
      return;
    }
  }

  function handleIncrementItemQuantity() {
    setItemQuantity((prevQuantity) => prevQuantity + 1);
  }

  function handleDecrementItemQuantity() {
    setItemQuantity((prevQuantity) => (prevQuantity !== 1 ? prevQuantity - 1 : 1));
  }

  return (
    <Grid
      container
      spacing={4}
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
            <Typography
              sx={{ paddingY: 1 }}
              lineHeight={1}
              component="h1"
              fontSize={30}>
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
                lineHeight={1}
                component="span"
                fontFamily={'Georgia'}
                fontStyle="italic"
                fontSize={42}>
                {formatCurrency(isOnSale ? discountedPrice : product.price)}
              </Typography>
              {isOnSale ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexWrap: 'nowrap',
                    paddingTop: 2,
                  }}>
                  <Typography
                    lineHeight={1}
                    component="span"
                    sx={{ textDecoration: 'line-through', opacity: '50%', paddingRight: 1 }}
                    fontFamily={'Georgia'}
                    fontStyle="italic"
                    fontSize={22}>
                    {formatCurrency(product.price)}
                  </Typography>
                  <Typography
                    lineHeight={1}
                    component="span"
                    fontSize={22}
                    fontFamily={'Georgia'}
                    fontStyle="italic"
                    sx={{ color: customColorPalette.blue.light, fontFamily: 'serif' }}>
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
              component="h3"
              fontWeight={600}
              fontSize={14}
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
                  component="span"
                  fontWeight={600}
                  fontSize={14}
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
                        backgroundColor: 'inherit',
                      },
                    }}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography
                    component="span"
                    fontWeight={600}
                    fontSize={16}
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
                    <Add fontSize="small" />
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
            <ContainedButton
              onClick={handleAddToCart}
              fullWidth
              label={isAddingToCart ? '' : 'add to cart'}
              backgroundColor="blue"
              isLoading={isAddingToCart}
              startIcon={<AddShoppingCart />}
            />
            <ContainedButton
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
              component="span"
              fontWeight={500}
              fontSize={16}
              sx={{ opacity: '70%' }}>
              Shipping
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalShippingOutlined />
              <Typography
                component="p"
                variant="body1">
                {product.delivery_info}
              </Typography>
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
              component="span"
              fontWeight={500}
              fontSize={16}
              sx={{ opacity: '70%' }}>
              Returns
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                component="p"
                variant="body1">
                {product.return_info}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingY: { xs: 1, sm: 2 } }}>
            <Typography
              component="span"
              fontWeight={500}
              fontSize={16}
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
