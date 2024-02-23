import { Box, ListItem, useMediaQuery, useTheme } from '@mui/material';
import { Divider } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { CartItemType } from '@/types';
import EditCartItemDrawer from '../../drawers/editCartItemDrawer/EditCartItemDrawer';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/selectors/cartSelectors';
import { BORDER_RADIUS } from '@/config';
import SaleBadgeLargeCartItem from './SaleBadgeLargeCartItem';
import BottomDetailsLargeCartItem from './BottomDetailsLargeCartItem';
import SelectionDetailsLargeCartItem from './SelectionDetailsLargeCartItem';
import TopDetailsLargeCartItem from './TopDetailsLargeCartItem';
import ImageLargeCartItem from './ImageLargeCartItem';
import PriceLargeCartItem from './PriceLargeCartItem';

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
          <ImageLargeCartItem
            productHref={`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`}
            imageUrl={imageUrl!}
            productName={item?.product?.name!}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {isBelowSmall ? (
              <TopDetailsLargeCartItem
                productHref={`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`}
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
              <TopDetailsLargeCartItem
                productHref={`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`}
                name={item?.product?.name!}
                brand={item?.product?.brand!}
              />
            ) : null}
          </Box>
          <SelectionDetailsLargeCartItem
            quantity={item.quantity}
            size={item.size}
          />
          <BottomDetailsLargeCartItem
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
            {isOnSale ? <SaleBadgeLargeCartItem percentage={item?.product?.salePercentage!} /> : null}
            <PriceLargeCartItem
              price={price}
              discountedPrice={discountedPrice}
              isOnSale={isOnSale}
            />
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
