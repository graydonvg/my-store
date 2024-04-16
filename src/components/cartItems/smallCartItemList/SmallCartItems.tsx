import { useAppSelector } from '@/lib/redux/hooks';
import { Divider } from '@mui/material';
import { Fragment } from 'react';
import SmallCartItem from '../smallCartItem/SmallCartItem';
import { usePathname } from 'next/navigation';

export default function SmallCartItems() {
  const pathname = usePathname();
  const { cartItems } = useAppSelector((state) => state.cart);
  const isShippingView = pathname.includes('/checkout/shipping');

  return cartItems.map((item, index) => {
    const isLastItem = cartItems.length - 1 === index;
    let showDivider;

    if (!isShippingView) {
      showDivider = true;
    } else if (isShippingView && !isLastItem) {
      showDivider = true;
    }

    return (
      <Fragment key={item?.cartItemId}>
        <SmallCartItem item={item} />
        {showDivider ? <Divider sx={{ borderColor: (theme) => theme.palette.custom.border }} /> : null}
      </Fragment>
    );
  });
}
