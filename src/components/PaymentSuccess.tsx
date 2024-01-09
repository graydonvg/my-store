'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { clearCart } from '@/lib/redux/cart/cartSlice';
import { resetCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import deleteAllCartItems from '@/services/cart/delete-all-cart-items';
import updateOrder from '@/services/orders/update';
import { Box, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const userId = useAppSelector((state) => state.user.userData?.userId);
  const customColorPalette = useCustomColorPalette();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (paymentStatus === 'success' && checkoutData.isProcessing === true) {
      const handleClearAllCartItems = async () => {
        dispatch(clearCart());

        const { success, message } = await deleteAllCartItems(userId!);

        if (success === false) {
          toast.error(message);
        }
      };

      handleClearAllCartItems();

      const handleUpdateOrderPaymentStatus = async () => {
        const { success, message } = await updateOrder({ orderId: checkoutData.orderId!, isPaid: true });

        if (success === false) {
          toast.error(message);
        }

        dispatch(resetCheckoutData());
        router.push('/orders');
      };

      handleUpdateOrderPaymentStatus();
    }
  }, [dispatch, userId, checkoutData.isProcessing, checkoutData.orderId, paymentStatus, router]);

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
        color={customColorPalette.typography}
        loading={true}
      />
    </Box>
  );
}
