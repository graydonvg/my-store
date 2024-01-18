'use client';

import { Box, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { Divider } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { CartItemType } from '@/types';
import EditCartItemDrawer from '../drawers/EditCartItemDrawer';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';
import Link from 'next/link';

type ProductNameAndBrandProps = {
  show: boolean;
  name: string;
  brand: string;
  productId: string;
  category: string;
};

function ProductNameAndBrand({ show, name, brand, productId, category }: ProductNameAndBrandProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <>
      <Link href={`/products/${category.toLowerCase()}/${productId}`}>
        <Typography
          lineHeight={1}
          component="p"
          fontWeight={600}
          fontSize={{ xs: 20, sm: 24 }}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            paddingRight: 3,
          }}>
          {name}
        </Typography>
      </Link>
      <Typography
        lineHeight={1}
        component="span"
        fontWeight={600}
        fontSize={14}
        color={colorPalette.typographyVariants.grey}
        sx={{
          display: '-webkit-box',
          marginTop: '6px',
        }}>
        {brand}
      </Typography>
    </>
  );
}

type FreeDeliveryTextProps = {
  show: boolean;
};

function FreeDeliveryText({ show }: FreeDeliveryTextProps) {
  if (!show) return null;

  return (
    <>
      Delivery Free
      <Divider
        component="span"
        sx={{ marginX: 1 }}
        variant="fullWidth"
        orientation="vertical"
      />
    </>
  );
}

type SalePercentageBadgeProps = {
  show: boolean;
  percentage: number;
};

function SalePercentageBadge({ show, percentage }: SalePercentageBadgeProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: borderRadius,
        paddingX: 1,
        marginRight: 1,
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
        fontSize={{ xs: 14, sm: 16 }}
        fontWeight={600}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}

type SalePriceProps = {
  show: boolean;
  price: number;
};

function SalePrice({ show, price }: SalePriceProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <Typography
      lineHeight={1}
      component="span"
      fontSize={{ xs: 20, sm: 24 }}
      fontWeight={400}
      color={colorPalette.typographyVariants.grey}
      sx={{ textDecoration: 'line-through' }}>
      {formatCurrency(price)}
    </Typography>
  );
}

type CartItemLargeProps = {
  item: CartItemType;
};

export default function CartItemLarge({ item }: CartItemLargeProps) {
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
        borderRadius: borderRadius,
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
          <Link href={`/products/${item?.product?.category.toLowerCase()}/${item?.product?.productId}`}>
            <Box
              sx={{
                display: 'flex',
                position: 'relative',
                aspectRatio: 3 / 4,
                width: { xs: '60px', sm: '160px' },
                flexShrink: 0,
              }}>
              <Image
                style={{ objectFit: 'cover', borderRadius: borderRadius }}
                fill
                sizes="180px 60px"
                src={imageUrl!}
                alt={`${item?.product?.name}`}
                priority
              />
            </Box>
          </Link>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ProductNameAndBrand
              show={isBelowSmall}
              productId={item?.product?.productId!}
              category={item?.product?.category!}
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
          <Box>
            <ProductNameAndBrand
              show={!isBelowSmall}
              productId={item?.product?.productId!}
              category={item?.product?.category!}
              name={item?.product?.name!}
              brand={item?.product?.brand!}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Qauntity', value: item?.quantity },
              { label: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: 'flex', gap: 1, alignItems: 'center', paddingRight: 2 }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontSize={{ xs: 14, sm: 16 }}
                  fontWeight={600}
                  color={colorPalette.typographyVariants.grey}>
                  {item.label}:
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
            fontSize={{ xs: 14, sm: 16 }}
            color={colorPalette.typographyVariants.grey}>
            <FreeDeliveryText show={discountedPrice > 500} />
            {item?.product?.returnInfo}
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
            <SalePercentageBadge
              show={isOnSale}
              percentage={item?.product?.salePercentage!}
            />
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}>
              <SalePrice
                show={isOnSale}
                price={price}
              />
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
