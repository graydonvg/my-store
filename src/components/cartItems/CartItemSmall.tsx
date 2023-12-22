'use client';

import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { Spinner } from '../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import deleteItemFromCart from '@/services/cart/delete-item-from-cart';
import { useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';

type Props = {
  item: CartItemType;
};

export default function CartItemSmall({ item }: Props) {
  const pathname = usePathname();
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const router = useRouter();
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isOnSale = item?.product?.on_sale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isShippingView = pathname.includes('shipping');

  async function handleRemoveCartItem(cartItemId: string) {
    setIsRemovingCartItem(true);
    try {
      const { success, message } = await deleteItemFromCart(cartItemId);
      if (success === true) {
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Failed to remove product from cart. Please try again later.`);
    } finally {
      setIsRemovingCartItem(false);
    }
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
        opacity: isRemovingCartItem ? '70%' : null,
        paddingY: 2,
      }}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 3 / 4,
          width: '60px',
          flexShrink: 0,
        }}>
        <Image
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          fill
          sizes="60px"
          src={item?.product?.product_image_data[0].image_url ?? ''}
          alt={`${item?.product?.name}`}
          priority
        />
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
                  size={12}
                  spinnerColor={mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.medium}
                />
              </Box>
            ) : (
              <IconButton
                disabled={isRemovingCartItem}
                onClick={() => handleRemoveCartItem(item?.cart_item_id!)}
                sx={{ padding: 0, width: 1, height: 1 }}>
                <Close
                  fontSize="small"
                  sx={{ opacity: '70%' }}
                />
              </IconButton>
            )}
          </Box>
        ) : null}
        <Box
          component="header"
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
          <Typography
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
            }}>
            {item?.product?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[
              { heading: 'QTY', value: item?.quantity },
              { heading: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.heading}
                sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  sx={{ opacity: '70%' }}
                  fontSize={13}>
                  {item.heading}:
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
                borderRadius: 1,
                paddingX: 1,
                backgroundColor: customColorPalette.blue.dark,
                width: 'fit-content',
                height: 'fit-content',
              }}>
              <Typography
                lineHeight={1.6}
                component="span"
                sx={{
                  color: customColorPalette.grey.light,
                }}
                fontSize={14}>
                {`-${item?.product?.sale_percentage}%`}
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
                  sx={{ textDecoration: 'line-through', opacity: '70%' }}
                  fontSize={16}
                  fontWeight={700}>
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
