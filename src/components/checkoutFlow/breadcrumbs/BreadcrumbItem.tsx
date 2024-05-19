import { useAppSelector } from '@/lib/redux/hooks';
import { Button, Typography, buttonBaseClasses, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';

type Props = {
  href: string;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  label: string;
  onLinkClick?: () => void;
};

export default function BreadcrumbItem({ href, icon, label, onLinkClick }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const { isProcessing } = useAppSelector((state) => state.checkout);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isPointerEventsDisabled =
    label === 'payment' ||
    label === 'confirmation' ||
    (label === 'shipping' && cartItems.length === 0) ||
    (label === 'shipping' && pathname.startsWith('/checkout/payment/confirmation')) ||
    (label === 'cart' && pathname.startsWith('/checkout/payment/confirmation')) ||
    isProcessing === true;

  return (
    <Link
      onClick={onLinkClick}
      href={href}
      tabIndex={-1}
      style={{
        pointerEvents: isPointerEventsDisabled ? 'none' : 'auto',
      }}>
      <Button
        disableTouchRipple
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          color: theme.palette.text.disabled,
          ...(pathname === href && {
            color: theme.palette.primary.light,
          }),
          [`&.${buttonBaseClasses.root}`]: { minWidth: { xs: 'unset', sm: '64px' } },
          '@media (hover: hover)': {
            '&:hover': {
              color: theme.palette.text.secondary,
              backgroundColor: 'transparent',
              ...(pathname === href && {
                color: theme.palette.primary.light,
              }),
            },
          },
        }}>
        {!isBelowSmall ? cloneElement(icon, { sx: { marginRight: 1, fontSize: { xs: 16, md: 18 } } }) : null}
        <Typography
          textTransform="uppercase"
          fontWeight={600}
          sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}>
          {label}
        </Typography>
      </Button>
    </Link>
  );
}
