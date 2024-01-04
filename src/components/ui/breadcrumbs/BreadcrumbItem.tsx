'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';
import { toast } from 'react-toastify';

type Props = {
  href: string;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  label: string;
};

export default function BreadcrumbItem({ href, icon, label }: Props) {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const shippingAddress = useAppSelector((state) => state.checkoutData.shippingAddress);
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const customColorPalette = useCustomColorPalette();

  async function handlePayWithStripe() {
    async function handlePayWithStripe() {
      try {
        dispatch(setCheckoutData({ isProcessing: true }));

        const error = await payWithStripe(cartItems);

        if (!!error) {
          dispatch(setCheckoutData({ isProcessing: false }));
        }
      } catch (error) {
        toast.error('Failed to process payment. Please try again later');
      }
    }
  }

  return (
    <Link
      onClick={label === 'payment' && shippingAddress ? handlePayWithStripe : undefined}
      href={href}
      tabIndex={-1}>
      <Button
        disableTouchRipple
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          color: pathname === href ? customColorPalette.blue.light : customColorPalette.grey.medium,
          '&.MuiButton-root': {
            minWidth: { xs: 'unset', sm: '64px' },
          },
          '@media (hover: hover)': {
            '&:hover': {
              color: pathname !== href ? customColorPalette.grey.light : null,
              backgroundColor: customColorPalette.grey.dark,
            },
          },
        }}>
        {cloneElement(icon, { sx: { mr: 1 }, fontSize: 'small' })}
        {!isBelowSmall ? (
          <Typography
            textTransform="uppercase"
            fontSize={14}
            fontWeight={600}>
            {label}
          </Typography>
        ) : null}
      </Button>
    </Link>
  );
}
