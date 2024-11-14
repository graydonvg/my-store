'use client';

import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

export default function NoRecentPayments() {
  const router = useRouter();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const redirectCountdown = 5;
  const [countdown, setCountdown] = useState(redirectCountdown);

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
      router.push('/');
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
        <Typography fontSize={{ xs: 24, sm: 40 }}>No new payment made.</Typography>
      </Box>
      <PulseLoader
        size={isBelowSmall ? 16 : 24}
        color={theme.palette.text.primary}
        loading={true}
      />
      <Box sx={{ height: { xs: '18px', sm: '30px' } }}>
        <Typography fontSize={{ xs: 12, sm: 16 }}>
          {`Redirecting you to home page in ${countdown} second${countdown > 1 ? 's' : ''}.`}
        </Typography>
      </Box>
      <Link href="/">
        <ContainedButton label="home" />
      </Link>
    </Box>
  );
}
