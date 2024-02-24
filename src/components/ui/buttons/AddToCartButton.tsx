import { toast } from 'react-toastify';
import addItemToCart from '@/services/cart/add';
import { updateCartItemQuantity } from '@/services/cart/update';
import { resetProductSelectionDetails } from '@/lib/redux/slices/productSelectionDetailsSlice';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import { Typography } from '@mui/material';
import ContainedButton from './ContainedButton';
import { useState } from 'react';
import { ProductType } from '@/types';
import { AddShoppingCart } from '@mui/icons-material';

function OpenCartDrawerToastButton() {
  const dispatch = useAppDispatch();

  function handleOpenCart() {
    dispatch(setIsCartOpen(true));
  }

  return (
    <Typography
      component="p"
      onClick={handleOpenCart}>
      Item added to cart.
    </Typography>
  );
}

type Props = {
  product: ProductType;
};

export default function AddToCartButton({ product }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userData } = useAppSelector((state) => state.user);
  const { cartItems } = useAppSelector((state) => state.cart);
  const { quantity, size } = useAppSelector((state) => state.productSelectionDetails);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function handleAddToCart() {
    if (!userData) {
      dispatch(openDialog('signInDialog'));
      return;
    }

    if (!size) {
      toast.error('Select a size first.');
      return;
    }

    setIsAddingToCart(true);

    const itemExists = cartItems.find((item) => item?.product?.productId === product.productId);

    if (itemExists && itemExists.size === size) {
      const { success, message } = await updateCartItemQuantity({
        cartItemId: itemExists.cartItemId,
        quantity: itemExists.quantity + quantity,
      });

      if (success === true) {
        router.refresh();
        toast.success(<OpenCartDrawerToastButton />);
      } else {
        toast.error(message);
      }

      dispatch(resetProductSelectionDetails());
    } else {
      const { success, message } = await addItemToCart({
        productId: product.productId,
        quantity: quantity,
        size: size!,
        userId: userData?.userId!,
      });

      if (success === true) {
        router.refresh();
        toast.success(<OpenCartDrawerToastButton />);
      } else {
        toast.error(message);
      }

      dispatch(resetProductSelectionDetails());
    }

    setIsAddingToCart(false);
  }
  return (
    <ContainedButton
      onClick={handleAddToCart}
      disabled={isAddingToCart}
      isLoading={isAddingToCart}
      fullWidth
      label={isAddingToCart ? '' : 'add to cart'}
      backgroundColor="primary"
      startIcon={<AddShoppingCart />}
    />
  );
}
