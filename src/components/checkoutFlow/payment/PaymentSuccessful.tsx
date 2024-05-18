'use client';

import { resetCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { CustomResponse } from '@/types';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

type Props = {
  clearCartResponse: CustomResponse;
};

export default function PaymentSuccessful({ clearCartResponse }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const redirectCountdown = 3;
  const [countdown, setCountdown] = useState(redirectCountdown);

  useEffect(() => {
    dispatch(resetCheckoutData());
  }, [dispatch]);

  useEffect(() => {
    if (!clearCartResponse.success) {
      toast.error(clearCartResponse.message);
    }
  }, [clearCartResponse.success, clearCartResponse.message]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          return 1;
        }
      });
    }, 1000);

    const timeout = setTimeout(() => {
      router.push('/orders');
    }, redirectCountdown * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

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
        color={theme.palette.text.primary}
        loading={true}
      />
      <Box sx={{ height: { xs: '18px', sm: '30px' } }}>
        <Typography fontSize={{ xs: 12, sm: 16 }}>
          {`Redirecting you to orders page in ${countdown} second${countdown > 1 ? 's' : ''}.`}
        </Typography>
      </Box>
    </Box>
  );
}
