import { useAppSelector } from '@/lib/redux/hooks';
import { Divider } from '@mui/material';
import { Fragment } from 'react';
import SmallCartItem from '../smallCartItem/SmallCartItem';
import { usePathname } from 'next/navigation';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';

export default function SmallCartItems() {
  const pathname = usePathname();
  const cartItems = useAppSelector(selectCartItems);
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return cartItems.map((item, index) => {
    const isLastItem = cartItems.length - 1 === index;
    let showDivider = false;

    if (!isShippingPath) {
      showDivider = true;
    } else if (isShippingPath && !isLastItem) {
      showDivider = true;
    }

    return (
      <Fragment key={item?.cartItemId}>
        <SmallCartItem item={item} />
        {showDivider ? <Divider /> : null}
      </Fragment>
    );
  });
}
