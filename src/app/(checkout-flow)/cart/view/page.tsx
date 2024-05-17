import CartPageClient from '@/components/checkoutFlow/CartPageClient';
import getCartAndWishlistData from '@/lib/db/queries/getCartAndWishlistData';

export default async function CartPage() {
  const { cartItems, wishlistData } = await getCartAndWishlistData();

  return (
    <>
      <CartPageClient
        cartItems={cartItems}
        wishlistData={wishlistData}
      />
    </>
  );
}
