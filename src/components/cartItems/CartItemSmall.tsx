'use client';

import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { Spinner } from '../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import deleteItemFromCart from '@/services/cart/delete-item-from-cart';
import { useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';

type LoadingSpinnerProps = {
  showSpinner: boolean;
};

function LoadingSpinner({ showSpinner }: LoadingSpinnerProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  if (!showSpinner) return null;

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
      <Spinner
        size={12}
        spinnerColor={mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.medium}
      />
    </Box>
  );
}

type DeleteCartItemButtonProps = {
  showButton: boolean;
  disabled: boolean;
  onClick: () => void;
};

function DeleteCartItemButton({ showButton, disabled, onClick }: DeleteCartItemButtonProps) {
  if (!showButton) return null;

  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      sx={{ padding: 0, width: 1, height: 1 }}>
      <Close
        fontSize="small"
        sx={{ opacity: '70%' }}
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
      <LoadingSpinner showSpinner={showSpinner} />
      <DeleteCartItemButton
        showButton={showDeleteButton}
        disabled={disabled}
        onClick={onClick}
      />
    </Box>
  );
}

type SalePercentageBadgeProps = {
  showBadge: boolean;
  percentage: number;
};

function SalePercentageBadge({ showBadge, percentage }: SalePercentageBadgeProps) {
  const customColorPalette = useCustomColorPalette();

  if (!showBadge) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: borderRadius,
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
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}

type SalePriceProps = {
  showPrice: boolean;
  price: number;
};

function SalePrice({ showPrice, price }: SalePriceProps) {
  if (!showPrice) return null;

  return (
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
  );
}

type CartItemSmallProps = {
  item: CartItemType;
};

export default function CartItemSmall({ item }: CartItemSmallProps) {
  const pathname = usePathname();
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const router = useRouter();
  const isOnSale = item?.product?.on_sale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isShippingView = pathname.includes('/checkout/shipping');

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
          style={{ objectFit: 'cover', borderRadius: borderRadius }}
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
        <CartItemButtons
          showButtons={!isShippingView}
          showSpinner={isRemovingCartItem}
          showDeleteButton={!isRemovingCartItem}
          disabled={isRemovingCartItem}
          onClick={() => handleRemoveCartItem(item?.cart_item_id!)}
        />
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
              { label: 'QTY', value: item?.quantity },
              { label: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  sx={{ opacity: '70%' }}
                  fontSize={13}>
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
            showBadge={isOnSale}
            percentage={item?.product?.sale_percentage!}
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
              showPrice={isOnSale}
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
