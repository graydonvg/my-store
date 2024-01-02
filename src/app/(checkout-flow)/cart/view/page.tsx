'use client';

import CartItemLarge from '@/components/cartItems/CartItemLarge';
import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { CartItemType } from '@/types';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

type CartEmptyProps = {
  showCartEmptyMessage: boolean;
};

function CartEmpty({ showCartEmptyMessage }: CartEmptyProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';

  if (!showCartEmptyMessage) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: cardBackgroundColor,
        borderRadius: borderRadius,
        paddingX: 2,
        paddingY: 4,
      }}>
      <Typography
        component="h1"
        fontSize={30}>
        Your cart is empty
      </Typography>
      <Link href={'/products/all-products'}>
        <Typography
          component="p"
          fontSize={24}
          sx={{ textDecoration: 'underline', color: customColorPalette.blue.dark }}>
          Continue shopping
        </Typography>
      </Link>
    </Box>
  );
}

type CartItemsProps = {
  showCartItems: boolean;
  cartItems: CartItemType[];
};

function CartItems({ showCartItems, cartItems }: CartItemsProps) {
  if (!showCartItems) return null;

  return (
    <>
      {cartItems.map((item) => (
        <CartItemLarge
          key={item?.cart_item_id}
          item={item}
        />
      ))}
    </>
  );
}

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <>
      <CartEmpty showCartEmptyMessage={cartItems.length === 0} />
      <CartItems
        showCartItems={cartItems.length !== 0}
        cartItems={cartItems}
      />
    </>
  );
}
