'use client';

import SmallCartItemList from '@/components/cartItems/SmallCartItemList';
import Addresses from '@/components/accountPage/sections/Addresses';
import { Box, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';

export default function Shipping() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  return (
    <Box
      sx={{
        backgroundColor: cardBackgroundColor,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRadius: '4px',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          component="h2"
          fontSize={24}
          fontWeight={400}>
          Select your address
        </Typography>
        <Addresses />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          component="h2"
          fontSize={24}
          fontWeight={400}>
          {`Your items (${cartItems.length})`}
        </Typography>
        <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: '4px' }}>
          <SmallCartItemList />
        </Box>
      </Box>
    </Box>
  );
}
