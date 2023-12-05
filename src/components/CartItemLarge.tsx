'use client';

import { Box, ListItem, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Divider } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { CartItemType } from '@/types';
import EditCartItemDrawer from './EditCartItemDrawer';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';

type Props = {
  item: CartItemType;
};

export default function CartItemLarge({ item }: Props) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isOnSale = item?.product?.on_sale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: mode === 'dark' ? customColorPalette.grey.dark : 'white',
        borderRadius: '4px',
        position: 'relative',
      }}>
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          zIndex: 1,
        }}>
        <EditCartItemDrawer cartItem={item} />
      </Box>
      <ListItem
        disableGutters
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              aspectRatio: 3 / 4,
              width: { xs: '60px', sm: '160px' },
              flexShrink: 0,
            }}>
            <Image
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              fill
              sizes="180px 60px"
              src={item?.product?.product_image_data[0].image_url ?? ''}
              alt={`${item?.product?.name}`}
              priority
            />
          </Box>
          <Typography
            lineHeight={1}
            component="p"
            fontWeight={600}
            fontSize={20}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: { xs: '-webkit-box', sm: 'none' },
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              paddingRight: 3,
            }}>
            {item?.product?.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            paddingTop: { xs: 0, sm: 1 },
            width: 1,
          }}>
          <Typography
            lineHeight={1}
            component="p"
            fontWeight={600}
            fontSize={24}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: { xs: 'none', sm: '-webkit-box' },
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              paddingRight: 3,
            }}>
            {item?.product?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { heading: 'Qauntity', value: item?.quantity },
              { heading: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.heading}
                sx={{ display: 'flex', gap: 1, alignItems: 'center', paddingRight: 2 }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  sx={{ opacity: '70%' }}
                  fontSize={{ xs: 14, sm: 16 }}
                  fontWeight={600}>
                  {item.heading}:
                </Typography>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontSize={16}
                  fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography
            lineHeight={1.6}
            component="p"
            sx={{ opacity: '70%' }}
            fontSize={{ xs: 14, sm: 16 }}>
            {discountedPrice > 500 ? (
              <>
                Delivery Free
                <Divider
                  component="span"
                  sx={{ marginX: 1 }}
                  variant="fullWidth"
                  orientation="vertical"
                />
              </>
            ) : null}
            {item?.product?.return_info}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              justifyContent: isOnSale ? 'space-between' : 'flex-end',
              paddingBottom: 2,
            }}>
            {isOnSale ? (
              <Box
                sx={{
                  display: 'flex',
                  borderRadius: 1,
                  paddingX: 1,
                  marginRight: 1,
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
                  fontSize={{ xs: 14, sm: 16 }}
                  fontWeight={600}>
                  {`-${item?.product?.sale_percentage}%`}
                </Typography>
              </Box>
            ) : null}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}>
              {isOnSale ? (
                <Typography
                  lineHeight={1}
                  component="span"
                  sx={{ textDecoration: 'line-through', opacity: '70%' }}
                  fontSize={{ xs: 20, sm: 24 }}
                  fontWeight={400}>
                  {formatCurrency(price)}
                </Typography>
              ) : null}
              <Typography
                lineHeight={1}
                component="span"
                variant="h6"
                fontSize={{ xs: 20, sm: 24 }}
                fontWeight={700}>
                {formatCurrency(isOnSale ? discountedPrice : price)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </ListItem>
      <Divider
        variant="fullWidth"
        flexItem
      />
    </Box>
  );
}
