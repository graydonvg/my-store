'use client';

import { Box, IconButton, ListItem, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { Spinner } from '../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useColorPalette from '@/hooks/useColorPalette';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { BORDER_RADIUS } from '@/config';
import { deleteItemFromCart } from '@/services/cart/delete';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

type Props = {
  item: CartItemType;
};

export default function CartItemSmall({ item }: Props) {
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
      <Box
        onClick={!isShippingView ? handleNavigateToProductPage : undefined}
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 3 / 4,
          width: '60px',
          flexShrink: 0,
          cursor: !isShippingView ? 'pointer' : 'default',
        }}>
        <Image
          style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS, opacity: !isImageLoaded ? 0 : 100 }}
          fill
          sizes="60px"
          src={imageUrl!}
          alt={`${item?.product?.name}`}
          priority
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded ? (
          <Skeleton
            height="100%"
            width="100%"
            variant="rectangular"
          />
        ) : null}
      </Box>
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
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'grid',
              placeItems: 'center',
              width: '20px',
              height: '20px',
            }}>
            {isRemovingCartItem ? (
              <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
                <Spinner
                  thickness={5}
                  size={12}
                  spinnerColor={colorPalette.typographyVariants.grey}
                />
              </Box>
            ) : null}
            {!isRemovingCartItem ? (
              <IconButton
                disabled={isRemovingCartItem}
                onClick={(e) => handleRemoveCartItem(e, item?.cartItemId!)}
                sx={{ padding: 0, width: 1, height: 1 }}>
                <Close
                  fontSize="small"
                  sx={{ color: colorPalette.typographyVariants.grey }}
                />
              </IconButton>
            ) : null}
          </Box>
        ) : null}
        <Box
          component="header"
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[
              { label: 'QTY', value: item?.quantity },
              { label: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontSize={13}
                  color={colorPalette.typographyVariants.grey}>
                  {item.label}:
                </Typography>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontWeight={600}
                  fontSize={13}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          component="footer"
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: 1 }}>
          {isOnSale ? (
            <Box
              sx={{
                display: 'flex',
                borderRadius: BORDER_RADIUS,
                paddingX: 1,
                backgroundColor: colorPalette.primary.dark,
                width: 'fit-content',
                height: 'fit-content',
              }}>
              <Typography
                lineHeight={1.6}
                component="span"
                sx={{
                  color: colorPalette.typographyVariants.white,
                }}
                fontSize={14}>
                {`-${item.product?.salePercentage}%`}
              </Typography>
            </Box>
          ) : null}
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
