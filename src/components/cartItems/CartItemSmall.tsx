'use client';

import { Box, IconButton, ListItem, Typography } from '@mui/material';
import Image from 'next/image';
import { Spinner } from '../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useColorPalette from '@/hooks/useColorPalette';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';
import { deleteItemFromCart } from '@/services/cart/delete';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

type LoadingSpinnerProps = {
  show: boolean;
};

function LoadingSpinner({ show }: LoadingSpinnerProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
      <Spinner
        thickness={5}
        size={12}
        spinnerColor={colorPalette.typographyVariants.grey}
      />
    </Box>
  );
}

type DeleteCartItemButtonProps = {
  show: boolean;
  disabled: boolean;
  onClick: () => void;
};

function DeleteCartItemButton({ show, disabled, onClick }: DeleteCartItemButtonProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      sx={{ padding: 0, width: 1, height: 1 }}>
      <Close
        fontSize="small"
        sx={{ color: colorPalette.typographyVariants.grey }}
      />
    </IconButton>
  );
}

type CartItemButtonsProps = {
  showButtons: boolean;
  showSpinner: boolean;
  showDeleteButton: boolean;
  disabled: boolean;
  onClick: () => void;
};

function CartItemButtons({ showButtons, showSpinner, showDeleteButton, disabled, onClick }: CartItemButtonsProps) {
  if (!showButtons) return null;

  return (
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
      <LoadingSpinner show={showSpinner} />
      <DeleteCartItemButton
        show={showDeleteButton}
        disabled={disabled}
        onClick={onClick}
      />
    </Box>
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
  );
}

type CartItemSmallProps = {
  item: CartItemType;
};

export default function CartItemSmall({ item }: CartItemSmallProps) {
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

  async function handleRemoveCartItem(cartItemId: string) {
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
          style={{ objectFit: 'cover', borderRadius: borderRadius }}
          fill
          sizes="60px"
          src={imageUrl!}
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
        <CartItemButtons
          showButtons={!isShippingView}
          showSpinner={isRemovingCartItem}
          showDeleteButton={!isRemovingCartItem}
          disabled={isRemovingCartItem}
          onClick={() => handleRemoveCartItem(item?.cartItemId!)}
        />
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
          <SalePercentageBadge
            show={isOnSale}
            percentage={item?.product?.salePercentage!}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              width: 1,
            }}>
            <SalePrice
              show={isOnSale}
              price={price}
            />
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
