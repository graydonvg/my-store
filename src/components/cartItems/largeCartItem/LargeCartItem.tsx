'use client';

import { Box, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Divider } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { CartItemType } from '@/types';
import EditCartItemDrawer from '../../drawers/EditCartItemDrawer';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { BORDER_RADIUS } from '@/config';
import LargeCartItemPriceWithLineThrough from './LargeCartItemPriceWithLineThrough';
import LargeCartItemSalePercentageBadge from './LargeCartItemSalePercentageBadge';
import LargeCartItemDeliveryAndReturnInfo from './LargeCartItemDeliveryReturnAndInfo';
import LargeCartItemSelectionDetails from './LargeCartItemSelectionDetails';
import LargeCartItemProductNameAndBrand from './LargeCartItemProductNameAndBrand';
import LargeCartItemImage from './LargeCartItemImage';

type Props = {
  item: CartItemType;
};

export default function LargeCartItem({ item }: Props) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const isOnSale = item?.product?.isOnSale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const imageUrl = item?.product?.productImageData.find((image) => image.index === 0)?.imageUrl;

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: colorPalette.card.background,
        borderRadius: BORDER_RADIUS,
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
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <LargeCartItemImage
            productHref={`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`}
            imageUrl={imageUrl!}
            productName={item?.product?.name!}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {isBelowSmall ? (
              <LargeCartItemProductNameAndBrand
                productId={item?.product?.productId!}
                category={item?.product?.category!}
                name={item?.product?.name!}
                brand={item?.product?.brand!}
              />
            ) : null}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            paddingTop: { xs: 0, sm: 1 },
            width: 1,
          }}>
          <Box>
            {!isBelowSmall ? (
              <LargeCartItemProductNameAndBrand
                productId={item?.product?.productId!}
                category={item?.product?.category!}
                name={item?.product?.name!}
                brand={item?.product?.brand!}
              />
            ) : null}
          </Box>
          <LargeCartItemSelectionDetails
            quantity={item.quantity}
            size={item.size}
          />
          <LargeCartItemDeliveryAndReturnInfo
            discountedPrice={discountedPrice}
            returnInfo={item.product?.returnInfo!}
          />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              justifyContent: isOnSale ? 'space-between' : 'flex-end',
              paddingBottom: 2,
            }}>
            {isOnSale ? <LargeCartItemSalePercentageBadge percentage={item?.product?.salePercentage!} /> : null}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}>
              {isOnSale ? <LargeCartItemPriceWithLineThrough price={price} /> : null}
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
