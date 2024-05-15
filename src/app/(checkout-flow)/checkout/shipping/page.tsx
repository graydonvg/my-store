'use client';

import SmallCartItemList from '@/components/cartItems/smallCartItemList/SmallCartItemList';
import Addresses from '@/components/addresses/Addresses';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import AccordionComponent from '@/components/ui/AccordionComponent';
import { BORDER_RADIUS } from '@/data';

export default function ShippingPage() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper
      sx={{
        paddingX: 2,
        paddingY: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRadius: BORDER_RADIUS,
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
    </Paper>
  );
}
