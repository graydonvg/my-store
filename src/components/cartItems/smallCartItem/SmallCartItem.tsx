import { Box, ListItem, Typography } from '@mui/material';
import { CartItemWithPriceDetails } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import DeleteCartItemButton from './SmallCartItemDeleteButton';
import SmallCartItemSaleBadge from './SmallCartItemSaleBadge';
import SmallCartItemSelectionDetails from './SelectionDetailsSmallCartItem';
import SmallCartItemImage from './SmallCartItemImage';
import SmallCartItemPrice from './SmallCartItemPrice';

type Props = {
  item: CartItemWithPriceDetails;
};

export default function SmallCartItem({ item }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isShippingPath = pathname.startsWith('/checkout/shipping');
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);

  function navigateToProductPage() {
    router.push(
      `/products/${item?.product?.category.toLowerCase()}/${item?.product?.name.toLowerCase().split(' ').join('-')}/${
        item?.product?.productId
      }`
    );

    dispatch(setIsCartOpen(false));
  }

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        opacity: isRemovingCartItem ? '50%' : null,
        paddingY: 2,
      }}>
      <SmallCartItemImage
        imageUrl={item.product?.productImageData[0].imageUrl ?? ''}
        onClick={navigateToProductPage}
        productName={item.product?.name ?? ''}
      />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexGrow: 1,
          height: 1,
        }}>
        {!isShippingPath ? (
          <DeleteCartItemButton
            item={item}
            setIsRemovingCartItem={setIsRemovingCartItem}
            isRemovingCartItem={isRemovingCartItem}
          />
        ) : null}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
          <Typography
            onClick={!isShippingPath ? navigateToProductPage : undefined}
            lineHeight={1}
            component="h4"
            fontWeight={600}
            fontSize={15}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              paddingRight: 3,
              cursor: !isShippingPath ? 'pointer' : 'default',
            }}>
            {item?.product?.name}
          </Typography>
          <SmallCartItemSelectionDetails
            quantity={item.quantity}
            size={item.size}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: 1 }}>
          {item?.product?.isOnSale ? <SmallCartItemSaleBadge percentage={item?.product?.salePercentage!} /> : null}
          <SmallCartItemPrice
            totalStandardPrice={item.totalStandardPrice}
            totalDiscountedPrice={item.totalDiscountedPrice}
            isOnSale={item?.product?.isOnSale!}
          />
        </Box>
      </Box>
    </ListItem>
  );
}
