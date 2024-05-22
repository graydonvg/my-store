import { toast } from 'react-toastify';
import addItemToCart from '@/services/cart/add';
import { updateCartItemQuantity } from '@/services/cart/update';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import ContainedButton from '../../../ui/buttons/simple/ContainedButton';
import { Dispatch, SetStateAction, useState } from 'react';
import { CartItem, Product } from '@/types';
import { AddShoppingCart } from '@mui/icons-material';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

type Props = {
  product: Product;
  size: string | null;
  setSize: Dispatch<SetStateAction<string | null>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

export default function AddToCartButton({ product, size, setSize, quantity, setQuantity }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useAppSelector(selectUserData);
  const cartItems = useAppSelector(selectCartItems);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addedToCartToastMessage = 'Added to cart';

  async function incrementItemQuantity(existingItem: CartItem) {
    const { success, message } = await updateCartItemQuantity({
      cartItemId: existingItem.cartItemId,
      quantity: existingItem.quantity + quantity,
    });

    if (success === true) {
      router.refresh();
      toast.success(addedToCartToastMessage);
      setSize(null);
      setQuantity(1);
    } else {
      toast.error(message);
    }
  }

  async function addNewItemToCart() {
    const { success, message } = await addItemToCart({
      productId: product.productId,
      quantity: quantity,
      size: size!,
    });

    if (success === true) {
      router.refresh();
      toast.success(addedToCartToastMessage);
      setSize(null);
      setQuantity(1);
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
      toast.error('Select a size first');
      return;
    }

    setIsAddingToCart(true);

    const itemExists = cartItems.find((item) => item?.product?.productId === product.productId);

    if (itemExists && itemExists.size === size) {
      await incrementItemQuantity(itemExists);
    } else {
      await addNewItemToCart();
    }

    setIsAddingToCart(false);
  }

  return (
    <ContainedButton
      onClick={addToCart}
      isLoading={isAddingToCart}
      fullWidth
      label={!isAddingToCart ? 'add to cart' : ''}
      color="secondary"
      startIcon={<AddShoppingCart />}
    />
  );
}
