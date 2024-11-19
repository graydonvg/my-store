import { Box, Paper } from '@mui/material';
import { Divider } from '@mui/material';
import { CartItemWithPriceDetails } from '@/types';
import EditCartItemDrawer from '../../drawers/editCartItemDrawer/EditCartItemDrawer';

import LargeCartItemSaleBadge from './LargeCartItemSaleBadge';
import LargeCartItemBottomDetails from './LargeCartItemBottomDetails';
import LargeCartItemSelectionDetails from './LargeCartItemSelectionDetails';
import LargeCartItemTopDetails from './LargeCartItemTopDetails';
import LargeCartItemImage from './LargeCartItemImage';
import LargeCartItemPrice from './LargeCartItemPrice';
import EditCartItemDrawerButton from './EditCartItemDrawerButton';
import { BORDER_RADIUS } from '@/constants';

type Props = {
  item: CartItemWithPriceDetails;
};

export default function LargeCartItem({ item }: Props) {
  const productHref = `/products/${item?.product?.category.toLowerCase()}/${item?.product?.name
    .toLowerCase()
    .split(' ')
    .join('-')}/${item?.product?.productId}`;

  return (
    <Paper
      sx={{
        padding: 2,
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
        <EditCartItemDrawerButton cartItem={item} />
        <EditCartItemDrawer cartItem={item} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <LargeCartItemImage
            productHref={productHref}
            productName={item?.product?.name!}
            imageUrl={item.product?.productImageData[0].imageUrl!}
          />

          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <LargeCartItemTopDetails
              productHref={productHref}
              name={item?.product?.name!}
              brand={item?.product?.brand!}
            />
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
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <LargeCartItemTopDetails
              productHref={productHref}
              name={item?.product?.name!}
              brand={item?.product?.brand!}
            />
          </Box>
          <LargeCartItemSelectionDetails
            quantity={item.quantity}
            size={item.size}
          />
          <LargeCartItemBottomDetails returnInfo={item.product?.returnInfo!} />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              justifyContent: item?.product?.isOnSale ? 'space-between' : 'flex-end',
              paddingBottom: 2,
            }}>
            {item?.product?.isOnSale ? <LargeCartItemSaleBadge percentage={item?.product?.salePercentage!} /> : null}
            <LargeCartItemPrice
              totalStandardPrice={item.totalStandardPrice}
              totalDiscountedPrice={item.totalDiscountedPrice}
              isOnSale={item?.product?.isOnSale!}
            />
          </Box>
        </Box>
      </Box>
      <Divider
        variant="fullWidth"
        flexItem
      />
    </Paper>
  );
}
