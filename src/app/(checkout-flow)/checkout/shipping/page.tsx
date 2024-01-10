'use client';

import SmallCartItemList from '@/components/cartItems/SmallCartItemList';
import Addresses from '@/components/accountPage/sections/Addresses';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import AccordionComponent from '@/components/ui/AccordionComponent';
import { borderRadius } from '@/constants/styles';

export default function Shipping() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        backgroundColor: colorPalette.card.background,
        paddingX: 2,
        paddingY: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRadius: borderRadius,
      }}>
      <AccordionComponent
        title="Select your address"
        defaultExpanded={true}>
        <Addresses />
      </AccordionComponent>
      <AccordionComponent
        title={`Your items (${cartItems.length})`}
        defaultExpanded={isBelowMedium ? false : true}>
        <SmallCartItemList paddingX={isBelowMedium ? 0 : 2} />
      </AccordionComponent>
    </Box>
  );
}
