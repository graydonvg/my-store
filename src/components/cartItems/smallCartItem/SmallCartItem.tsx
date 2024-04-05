import { Box, ListItem, Typography } from '@mui/material';
import { CartItemType } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/selectors/cartSelectors';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import DeleteCartItemButton from './DeleteButtonSmallCartItem';
import SaleBadgeSmallCartItem from './SaleBadgeSmallCartItem';
import SelectionDetailsSmallCartItem from './SelectionDetailsSmallCartItem';
import ImageSmallCartItem from './ImageSmallCartItem';
import PriceSmallCartItem from './PriceSmallCartItem';

type Props = {
  item: CartItemType;
};

export default function SmallCartItem({ item }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOnSale = item?.product?.isOnSale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isShippingView = pathname.includes('/checkout/shipping');
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const imageUrl = item?.product?.productImageData.find((image) => image.index === 0)?.imageUrl;

  function navigateToProductPage() {
    router.push(`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`);
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
      <ImageSmallCartItem
        imageUrl={imageUrl!}
        onClick={navigateToProductPage}
        productName={item.product?.name!}
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
        {!isShippingView ? (
          <DeleteCartItemButton
            item={item}
            setIsRemovingCartItem={setIsRemovingCartItem}
            isRemovingCartItem={isRemovingCartItem}
          />
        ) : null}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
          <Typography
            onClick={!isShippingView ? navigateToProductPage : undefined}
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
              cursor: !isShippingView ? 'pointer' : 'default',
            }}>
            {item?.product?.name}
          </Typography>
          <SelectionDetailsSmallCartItem
            quantity={item.quantity}
            size={item.size}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: 1 }}>
          {isOnSale ? <SaleBadgeSmallCartItem percentage={item?.product?.salePercentage!} /> : null}
          <PriceSmallCartItem
            price={price}
            discountedPrice={discountedPrice}
            isOnSale={isOnSale}
          />
        </Box>
      </Box>
    </ListItem>
  );
}
