'use client';

import SmallCartItemList from '@/components/cartItems/smallCartItemList/SmallCartItemList';
import Addresses from '@/components/addresses/Addresses';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AccordionComponent from '@/components/ui/AccordionComponent';
import { BORDER_RADIUS } from '@/data';
import { useEffect } from 'react';
import { setAddresses } from '@/lib/redux/features/addresses/addressesSlice';
import { AddressType } from '@/types';

type Props = {
  addresses: AddressType[] | null;
};

export default function ShippingPageClient({ addresses }: Props) {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(setAddresses(addresses));
  }, [addresses, dispatch]);

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