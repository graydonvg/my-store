import { useAppSelector } from '@/lib/redux/hooks';
import { Divider, ListItem } from '@mui/material';
import { Fragment } from 'react';
import SmallCartItem from '../smallCartItem/SmallCartItem';
import { usePathname } from 'next/navigation';
import { selectCartItemsWithPriceDetails } from '@/lib/redux/features/cart/cartSelectors';

export default function SmallCartItems() {
  const pathname = usePathname();
  const cartItemsWithPriceDetails = useAppSelector(selectCartItemsWithPriceDetails);
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return cartItemsWithPriceDetails.map((item, index) => {
    const isLastItem = cartItemsWithPriceDetails.length - 1 === index;
    let showDivider = false;

    if (!isShippingPath) {
      showDivider = true;
    } else if (isShippingPath && !isLastItem) {
      showDivider = true;
    }

    return (
      <Fragment key={item?.cartItemId}>
        <SmallCartItem item={item} />
        {showDivider ? (
          <ListItem
            disableGutters
            disablePadding>
            <Divider sx={{ width: 1 }} />
          </ListItem>
        ) : null}
      </Fragment>
    );
  });
}
