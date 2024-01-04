'use client';

import CartItemLarge from '@/components/cartItems/CartItemLarge';
import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { CartItemType } from '@/types';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type CartEmptyProps = {
  show: boolean;
};

function CartEmpty({ show }: CartEmptyProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';

  if (!show) return null;

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
        component="p"
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
  show: boolean;
  cartItems: CartItemType[];
};

function CartItems({ show, cartItems }: CartItemsProps) {
  if (!show) return null;

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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (paymentStatus === 'cancel') {
      dispatch(setCheckoutData({ isProcessing: false }));
    }
  }, [dispatch, paymentStatus]);

  return (
    <>
      <CartEmpty show={cartItems.length === 0} />
      <CartItems
        show={cartItems.length !== 0}
        cartItems={cartItems}
      />
    </>
  );
}
