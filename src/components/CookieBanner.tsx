'use client';

import { Box, Typography } from '@mui/material';
import TextButton from './ui/buttons/TextButton';
import ContainedButton from './ui/buttons/ContainedButton';
import { BORDER_RADIUS } from '@/constants';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '@/utils/storageHelper';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(getLocalStorage('cookie_consent', null));

  useEffect(() => {
    const newValue = cookieConsent ? 'granted' : 'denied';

    window.gtag &&
      window.gtag('consent', 'update', {
        analytics_storage: newValue,
      });

    setLocalStorage('cookie_consent', cookieConsent);
  }, [cookieConsent]);

  return (
    <Box
      sx={{
        display: cookieConsent !== null ? 'none' : 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        position: 'fixed',
        bottom: '16px',
        left: 0,
        right: 0,
        width: 1,
        maxWidth: { sm: '600px' },
        borderRadius: BORDER_RADIUS,
        margin: '0 auto',
        padding: 2,
        backgroundColor: (theme) => theme.palette.custom.navbar.upper.background,
      }}>
      <Typography>This site uses cookies.</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <TextButton
          label="Decline"
          onClick={() => setCookieConsent(false)}
          sxStyles={{ minHeight: '32px', height: '32px' }}
        />
        <ContainedButton
          label="Allow Cookies"
          onClick={() => setCookieConsent(true)}
          sxStyles={{ minHeight: '32px', height: '32px' }}
        />
      </Box>
    </Box>
  );
}
