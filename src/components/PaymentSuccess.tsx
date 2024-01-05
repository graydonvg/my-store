'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { clearCart } from '@/lib/redux/cart/cartSlice';
import { resetCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import deleteAllCartItems from '@/services/cart/delete-all-cart-items';
import updateOrder from '@/services/orders/update';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const user_id = useAppSelector((state) => state.user.currentUser?.user_id);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const loaderColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  // Fix this
  // Fix this
  // Returns success false and true
  const clearCartItems = useCallback(
    async function clearAllCartItems() {
      dispatch(clearCart());
      await deleteAllCartItems(user_id!);
      // const { success, message } = await deleteAllCartItems(user_id!);

      // if (success === false) {
      //   toast.error(message);
      // }
    },
    [dispatch, user_id]
  );

  const updateOrderPaymentStatus = useCallback(
    async function handleUpdateOrderPaymentStatus() {
      const { success, message } = await updateOrder({ order_id: checkoutData.orderId!, is_paid: true });

      if (success === false) {
        toast.error(message);
      } else {
        dispatch(resetCheckoutData());
        router.push('/orders');
      }
    },

    [dispatch, checkoutData.orderId, router]
  );

  useEffect(() => {
    if (checkoutData.isProcessing === true) {
      clearCartItems();
      updateOrderPaymentStatus();
    }
  }, [dispatch, checkoutData.isProcessing, clearCartItems, updateOrderPaymentStatus, router]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
      <Typography fontSize={{ xs: 16, sm: 36 }}>Payment successful!</Typography>
      <Typography fontSize={{ xs: 14, sm: 24 }}>Thank you for your order!</Typography>
      <PulseLoader
        size={24}
        color={loaderColor}
        loading={true}
      />
    </Box>
  );
}
