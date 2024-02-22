import { Box, ListItem, Typography } from '@mui/material';
import { CartItemType } from '@/types';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/selectors/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { deleteItemFromCart } from '@/services/cart/delete';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import DeleteCartItemButton from './DeleteButtonSmallCartItem';
import SaleBadgeSmallCartItem from './SaleBadgeSmallCartItem';
import SelectionDetailsSmallCartItem from './SelectionDetailsSmallCartItem';
import ImageSmallCartItem from './ImageSmallCartItem';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  item: CartItemType;
};

export default function SmallCartItem({ item }: Props) {
  const colorPalette = useColorPalette();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOnSale = item?.product?.isOnSale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isShippingView = pathname.includes('/checkout/shipping');
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const imageUrl = item?.product?.productImageData.find((image) => image.index === 0)?.imageUrl;

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [item]);

  async function handleRemoveCartItem(event: MouseEvent, cartItemId: string) {
    event.stopPropagation();

    setIsRemovingCartItem(true);

    const { success, message } = await deleteItemFromCart(cartItemId);

    if (success === true) {
      router.refresh();
    } else {
      toast.error(message);
    }
  }

  function handleNavigateToProductPage() {
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
        onClick={handleNavigateToProductPage}
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
            isLoading={isRemovingCartItem}
            onClick={(e: MouseEvent<HTMLButtonElement>) => handleRemoveCartItem(e, item?.cartItemId!)}
          />
        ) : null}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
          <Typography
            onClick={!isShippingView ? handleNavigateToProductPage : undefined}
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
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              width: 1,
            }}>
            {isOnSale ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontSize={16}
                  fontWeight={700}
                  color={colorPalette.typographyVariants.grey}
                  sx={{ textDecoration: 'line-through' }}>
                  {formatCurrency(price)}
                </Typography>
              </Box>
            ) : null}

            <Typography
              lineHeight={1}
              component="span"
              variant="h6"
              fontSize={16}
              fontWeight={700}>
              {formatCurrency(isOnSale ? discountedPrice : price)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
