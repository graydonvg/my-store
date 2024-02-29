import { Box, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';
import { useEffect, useState } from 'react';
import { setCartItemQuantityWillUpdate } from '@/lib/redux/slices/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

type Props = {
  cartItem: CartItemType;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
};

export default function QuantityPickerEditCartItemDrawer({ cartItem, updateCartItemQuantity }: Props) {
  const dispatch = useAppDispatch();
  const [cartItemQuantity, setCartItemQuantity] = useState(cartItem.quantity);
  const [updateCartItemQuantityTimer, setUpdateCartItemQuantityTimer] = useState<NodeJS.Timeout | null>(null);

  function handleIncrementCartItemQuantity() {
    dispatch(setCartItemQuantityWillUpdate(true));

    const newQuantity = cartItemQuantity + 1;
    setCartItemQuantity(newQuantity);
    scheduleUpdateCartItemQuantityWithDelay(newQuantity);
  }

  function handleDecrementCartItemQuantity() {
    if (cartItemQuantity === 1) return;
    dispatch(setCartItemQuantityWillUpdate(true));
    const newQuantity = cartItemQuantity - 1;
    setCartItemQuantity(newQuantity);
    scheduleUpdateCartItemQuantityWithDelay(newQuantity);
  }

  function scheduleUpdateCartItemQuantityWithDelay(newQuantity: number) {
    // Add a delay before updating the quantity in case the use presses the button multiple times.
    if (updateCartItemQuantityTimer) {
      clearTimeout(updateCartItemQuantityTimer);
    }
    const newTimer = setTimeout(async () => {
      await updateCartItemQuantity(cartItem.cartItemId, newQuantity);
    }, 1000);
    setUpdateCartItemQuantityTimer(newTimer);
  }

  useEffect(() => {
    return () => {
      if (updateCartItemQuantityTimer) {
        clearTimeout(updateCartItemQuantityTimer);
      }
    };
  }, [updateCartItemQuantityTimer]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 1,
      }}>
      <Typography
        component="span"
        fontWeight={600}
        fontSize={14}
        sx={{ textTransform: 'uppercase' }}>
        Quantity
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton
          onClick={handleDecrementCartItemQuantity}
          sx={{
            color: 'inherit',
            height: '48px',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'inherit',
            },
          }}>
          <Remove fontSize="small" />
        </IconButton>
        <Typography
          component="span"
          fontWeight={600}
          fontSize={16}
          sx={{ width: '4ch', display: 'grid', placeItems: 'center' }}>
          {cartItemQuantity}
        </Typography>
        <IconButton
          onClick={handleIncrementCartItemQuantity}
          sx={{
            color: 'inherit',
            height: '48px',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}>
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
