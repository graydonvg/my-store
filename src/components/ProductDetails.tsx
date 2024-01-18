'use client';

import { ProductType } from '@/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import ToggleButtons from './ui/buttons/ToggleButtons';
import ContainedButton from './ui/buttons/ContainedButton';
import {
  Add,
  AddShoppingCart,
  ExpandMore,
  Favorite,
  LocalShippingOutlined,
  Remove,
  ShoppingCart,
} from '@mui/icons-material';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { MouseEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import addItemToCart from '@/services/cart/add';
import { setIsSignInDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { orderedSizesForToggleButtons } from '@/constants/sizes';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import { borderRadius } from '@/constants/styles';
import { sortItemSizesArrayForToggleButtons } from '@/utils/sortItemSizesArray';
import { updateCartItemQuantity } from '@/services/cart/update';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

function OpenCartDrawerToastButton() {
  const dispatch = useAppDispatch();

  function handleOpenCart() {
    dispatch(setIsCartOpen(true));
  }

  return (
    <Typography
      component="p"
      onClick={handleOpenCart}>
      Item added to cart.
    </Typography>
  );
}

type PreviousPriceAndPercentageProps = {
  show: boolean;
  price: number;
  percentage: number;
};

function PreviousPriceAndPercentage({ show, price, percentage }: PreviousPriceAndPercentageProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignSelf: 'flex-end',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}>
      <Typography
        lineHeight={1.3}
        component="span"
        fontFamily={'Georgia'}
        fontStyle="italic"
        fontSize={22}
        color={colorPalette.typographyVariants.grey}
        sx={{ textDecoration: 'line-through', paddingRight: 1 }}>
        {formatCurrency(price)}
      </Typography>
      <Typography
        lineHeight={1}
        component="span"
        fontSize={22}
        fontFamily={'Georgia'}
        fontStyle="italic"
        sx={{ color: colorPalette.primary.light, fontFamily: 'serif' }}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}

type SelectItemQuantityProps = {
  show: boolean;
  quantity: number;
  increment: () => void;
  decrement: () => void;
};

function SelectItemQuantity({ show, quantity, increment, decrement }: SelectItemQuantityProps) {
  if (!show) return null;

  return (
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
            onClick={decrement}
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
            {quantity}
          </Typography>
          <IconButton
            onClick={increment}
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
  );
}

type DetailsHeadingProps = {
  children: ReactNode;
};

function DetailsHeading({ children }: DetailsHeadingProps) {
  const colorPalette = useColorPalette();

  return (
    <Typography
      component="span"
      fontWeight={500}
      fontSize={16}
      color={colorPalette.typographyVariants.grey}>
      {children}
    </Typography>
  );
}

type ProductDetailsProps = {
  product: ProductType;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userData } = useAppSelector((state) => state.user);
  const { cartItems } = useAppSelector((state) => state.cart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemSize, setItemSize] = useState<string | null>(null);
  const isOnSale = product.isOnSale === 'Yes';
  const discountedPrice = calculateDiscountedProductPrice(product);

  function getItemSizeToggleButtonOptions() {
    const availableSizes = product.sizes
      .map((size) => orderedSizesForToggleButtons.filter((option) => option.value === size)[0])
      .sort(sortItemSizesArrayForToggleButtons);

    return availableSizes;
  }

  function handleSelectSize(e: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setItemSize((prevSize) => (prevSize !== selectedSize ? selectedSize : null));
  }

  function handleOpenSignInDialog() {
    dispatch(setIsSignInDialogOpen(true));
  }

  function handleSelectSizeToast() {
    toast.error('Select a size first.');
  }

  function handleIncrementItemQuantity() {
    setItemQuantity((prevQuantity) => prevQuantity + 1);
  }

  function handleDecrementItemQuantity() {
    setItemQuantity((prevQuantity) => (prevQuantity !== 1 ? prevQuantity - 1 : 1));
  }

  async function handleAddToCart() {
    if (!userData) {
      handleOpenSignInDialog();
      return;
    }

    if (!itemSize) {
      handleSelectSizeToast();
      return;
    }

    setIsAddingToCart(true);

    const itemExists = cartItems.find((item) => item?.product?.productId === product.productId);

    if (itemExists && itemExists.size === itemSize) {
      const { success, message } = await updateCartItemQuantity({
        cartItemId: itemExists.cartItemId,
        quantity: itemExists.quantity + itemQuantity,
      });

      if (success === true) {
        router.refresh();
        toast.success(<OpenCartDrawerToastButton />);
      } else {
        toast.error(message);
      }

      setItemQuantity(1);
    } else {
      const { success, message } = await addItemToCart({
        productId: product.productId,
        quantity: itemQuantity,
        size: itemSize!,
        userId: userData?.userId!,
      });

      if (success === true) {
        router.refresh();
        toast.success(<OpenCartDrawerToastButton />);
      } else {
        toast.error(message);
      }

      setItemQuantity(1);
    }

    setIsAddingToCart(false);
  }

  function handleAddToWishlist() {
    // check if item already added!!!

    toast.info('Coming soon!');

    // if (!userData) {
    //   handleOpenSignInDialog();
    //   return;
    // }

    // if (!itemSize) {
    //   handleSelectSizeToast();
    //   return;
    // }
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
            <Box>
              <Typography
                sx={{ paddingY: 1 }}
                lineHeight={1.2}
                component="h1"
                fontSize={30}>
                {product.name}
              </Typography>
              <Typography
                sx={{ paddingY: 1 }}
                lineHeight={1}
                component="span"
                fontSize={16}
                color={colorPalette.typographyVariants.grey}>
                {product.brand}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                rowGap: 1,
                columnGap: 2,
              }}>
              <Typography
                lineHeight={1}
                component="span"
                fontFamily={'Georgia'}
                fontStyle="italic"
                fontSize={42}>
                {formatCurrency(isOnSale ? discountedPrice : product.price)}
              </Typography>
              <PreviousPriceAndPercentage
                show={isOnSale}
                price={product.price}
                percentage={product.salePercentage}
              />
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
              buttons={getItemSizeToggleButtonOptions()}
              selection={itemSize ? [itemSize] : []}
            />
          </Box>
          <SelectItemQuantity
            show={!!itemSize}
            quantity={itemQuantity}
            increment={handleIncrementItemQuantity}
            decrement={handleDecrementItemQuantity}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              paddingY: 4,
            }}>
            <ContainedButton
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              isLoading={isAddingToCart}
              fullWidth
              label={isAddingToCart ? '' : 'add to cart'}
              backgroundColor="blue"
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
            <DetailsHeading>Shipping</DetailsHeading>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 1 }}>
              <LocalShippingOutlined />
              <Typography
                component="p"
                variant="body1">
                {product.deliveryInfo}
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
            <DetailsHeading>Returns</DetailsHeading>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 1 }}>
              <Typography
                component="p"
                variant="body1">
                {product.returnInfo}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Accordion
            elevation={0}
            disableGutters
            defaultExpanded={true}
            sx={{ borderRadius: borderRadius, backgroundColor: 'transparent' }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                padding: 0,
                minHeight: 'unset',
                paddingY: { xs: 1, sm: 2 },
                '& .MuiAccordionSummary-content': {
                  margin: '0',
                },
              }}>
              <DetailsHeading>Product Details</DetailsHeading>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <List
                sx={{
                  listStyleType: 'disc',
                  paddingLeft: 3,
                  '& .MuiListItem-root': {
                    display: 'list-item',
                  },
                }}>
                {product.details?.split(',').map((detail, index) => (
                  <ListItem
                    key={index}
                    sx={{ padding: 0, paddingBottom: 1 }}>
                    <Typography component="p">{detail}</Typography>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Grid>
    </Grid>
  );
}
