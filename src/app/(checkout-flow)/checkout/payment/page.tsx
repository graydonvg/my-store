'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { clearCart } from '@/lib/redux/cart/cartSlice';
import { resetCheckoutData, setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteAllCartItems } from '@/services/cart/delete';
import updateOrderPaymentStatus from '@/services/orders/update';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const colorPalette = useColorPalette();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment-status');
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [showUpdatingPaymentMessage, setShowUpdatingPaymentMessage] = useState(false);
  const redirectCountdown = 2;

  useEffect(() => {
    if (paymentStatus === 'success' && checkoutData.isProcessing === true) {
      const handleClearAllCartItems = async () => {
        dispatch(clearCart());

        const { success, message } = await deleteAllCartItems();

        if (success === false) {
          toast.error(message);
        }
      };

      handleClearAllCartItems();

      const handleUpdateOrderPaymentStatus = async () => {
        setShowUpdatingPaymentMessage(true);

        const { success, message } = await updateOrderPaymentStatus({ orderId: checkoutData.orderId!, isPaid: true });

        if (success === false) {
          toast.error(message);
          dispatch(setCheckoutData({ isProcessing: false }));
        } else {
          dispatch(resetCheckoutData());
        }

        setShowUpdatingPaymentMessage(false);
        setShowRedirectMessage(true);
        setTimeout(() => {
          router.push('/orders');
        }, redirectCountdown * 1000);
      };

      handleUpdateOrderPaymentStatus();
    }
  }, [dispatch, checkoutData.userId, checkoutData.isProcessing, checkoutData.orderId, paymentStatus, router]);

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
        width: 1,
        gap: 4,
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
        <Typography fontSize={{ xs: 24, sm: 40 }}>Payment successful!</Typography>
        <Typography fontSize={{ xs: 16, sm: 24 }}>Thank you for your order!</Typography>
      </Box>
      <PulseLoader
        size={isBelowSmall ? 16 : 24}
        color={colorPalette.typography}
        loading={true}
      />
      <Box sx={{ height: { xs: '18px', sm: '30px' } }}>
        <Typography fontSize={{ xs: 12, sm: 16 }}>
          {!showUpdatingPaymentMessage ? '' : 'Updating payment status.'}
          {!showRedirectMessage ? null : `Redirecting you to orders page in ${redirectCountdown} seconds.`}
        </Typography>
      </Box>
    </Box>
  );
}
