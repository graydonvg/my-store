import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import addItemToCart from '@/services/cart/add';
import { updateCartItemQuantity } from '@/services/cart/update';
import { deleteItemFromWishlist } from '@/services/wishlist/delete';
import { CartItem, Product } from '@/types';
import { AddShoppingCart } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

type Props = {
  product: Product;
  wishlistSize: string;
  wishlistItemId: number;
};

export default function MoveToCartButton({ product, wishlistSize, wishlistItemId }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const [isLoading, setIsLoading] = useState(false);
  const addedToCartToastMessage = 'Moved to cart';

  async function removeWishlistItem() {
    const { success, message } = await deleteItemFromWishlist(wishlistItemId);

    if (!success) {
      toast.error(message);
    }
  }

  async function incrementItemQuantity(existingItem: CartItem) {
    const { success, message } = await updateCartItemQuantity({
      cartItemId: existingItem.cartItemId,
      quantity: existingItem.quantity + 1,
    });

    if (success) {
      await removeWishlistItem();
      router.refresh();
      toast.success(addedToCartToastMessage);
    } else {
      toast.error(message);
    }
  }

  async function addNewItemToCart() {
    const result = await addItemToCart({
      productId: product.productId,
      quantity: 1,
      size: wishlistSize,
    });

    if (result.some((res) => !res.success)) {
      result.forEach((res) => !res.success && toast.error(res.message));
    } else {
      await removeWishlistItem();
      router.refresh();
      toast.success(addedToCartToastMessage);
    }
  }

  async function moveToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setIsLoading(true);

    const itemExists = cartItems.find((item) => item?.product?.productId === product.productId);

    if (itemExists && itemExists.size === wishlistSize) {
      await incrementItemQuantity(itemExists);
    } else {
      await addNewItemToCart();
    }

    setIsLoading(false);
  }

  return (
    <>
      {!isLoading ? (
        <IconButton
          onClick={(e) => moveToCart(e)}
          disabled={isLoading}
          disableRipple
          sx={{
            width: 'fit-content',
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: theme.palette.text.primary,
            padding: 0,
            paddingBottom: 1,
          }}>
          <AddShoppingCart />
        </IconButton>
      ) : (
        <PulseLoader
          color={theme.palette.text.primary}
          loading={isLoading}
          size={10}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 0,
          }}
        />
      )}
    </>
  );
}
