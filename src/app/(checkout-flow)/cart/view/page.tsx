import CartPageClient from '@/components/checkoutFlow/cart/CartPageClient';
import fetchCartAndWishlistData from '@/services/db/queries/fetchCartAndWishlistData';

export default async function CartPage() {
  const { cartItems, wishlistData } = await fetchCartAndWishlistData();

  return (
    <CartPageClient
      cartItems={cartItems}
      wishlistData={wishlistData}
    />
  );
}
