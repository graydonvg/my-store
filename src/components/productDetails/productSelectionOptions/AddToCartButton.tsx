import { toast } from 'react-toastify';
import addItemToCart from '@/services/cart/add';
import { updateCartItemQuantity } from '@/services/cart/update';
import { resetProductSelectionDetails } from '@/lib/redux/slices/productSelectionDetailsSlice';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { useState } from 'react';
import { CartItemType, ProductType } from '@/types';
import { AddShoppingCart } from '@mui/icons-material';

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
  const addedToCartToastMessage = 'Item added to cart.';

  async function incrementItemQuantity(existingItem: CartItemType) {
    const { success, message } = await updateCartItemQuantity({
      cartItemId: existingItem.cartItemId,
      quantity: existingItem.quantity + quantity,
    });

    if (success === true) {
      router.refresh();
      toast.success(addedToCartToastMessage);
    } else {
      toast.error(message);
    }
  }

  async function addNewItemToCart() {
    const { success, message } = await addItemToCart({
      productId: product.productId,
      quantity: quantity,
      size: size!,
      userId: userData?.userId!,
    });

    if (success === true) {
      router.refresh();
      toast.success(addedToCartToastMessage);
    } else {
      toast.error(message);
    }
  }

  async function addToCart() {
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
      await incrementItemQuantity(itemExists);

      dispatch(resetProductSelectionDetails());
    } else {
      await addNewItemToCart();

      dispatch(resetProductSelectionDetails());
    }

    setIsAddingToCart(false);
  }

  return (
    <ContainedButton
      onClick={addToCart}
      disabled={isAddingToCart}
      isLoading={isAddingToCart}
      fullWidth
      label={!isAddingToCart ? 'add to cart' : ''}
      backgroundColor="primary"
      startIcon={<AddShoppingCart />}
    />
  );
}
