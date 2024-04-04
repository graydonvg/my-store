import useColorPalette from '@/hooks/useColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import addItemToCart from '@/services/cart/add';
import { updateCartItemQuantity } from '@/services/cart/update';
import { CartItemType, ProductType } from '@/types';
import { AddShoppingCart } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

type Props = {
  product: ProductType;
  wishlistSize: string;
};

export default function MoveToCartButton({ product, wishlistSize }: Props) {
  const colorPalette = useColorPalette();
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { userData } = useAppSelector((state) => state.user);
  const [isMovingToCart, setIsMovingToCart] = useState(false);
  const addedToCartToastMessage = 'Item added to cart.';

  async function incrementItemQuantity(existingItem: CartItemType) {
    const { success, message } = await updateCartItemQuantity({
      cartItemId: existingItem.cartItemId,
      quantity: existingItem.quantity + 1,
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
      quantity: 1,
      size: wishlistSize,
      userId: userData?.userId!,
    });

    if (success === true) {
      router.refresh();
      toast.success(addedToCartToastMessage);
    } else {
      toast.error(message);
    }
  }

  async function moveToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setIsMovingToCart(true);

    const itemExists = cartItems.find((item) => item?.product?.productId === product.productId);

    if (itemExists && itemExists.size === wishlistSize) {
      await incrementItemQuantity(itemExists);
    } else {
      await addNewItemToCart();
    }

    setIsMovingToCart(false);
  }

  return (
    <>
      {!isMovingToCart ? (
        <IconButton
          onClick={(e) => moveToCart(e)}
          disabled={isMovingToCart}
          disableRipple
          sx={{
            width: 'fit-content',
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: colorPalette.typography,
          }}>
          <AddShoppingCart />
        </IconButton>
      ) : (
        <PulseLoader
          color={colorPalette.typography}
          loading={isMovingToCart}
          size={10}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 0,
            color: colorPalette.typography,
          }}
        />
      )}
    </>
  );
}
