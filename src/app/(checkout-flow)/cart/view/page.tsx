import CartPageClient from '@/components/checkoutFlow/CartPageClient';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';
import getCartAndWishlistData from '@/lib/db/queries/getCartAndWishlistData';

export default async function CartPage() {
  const { cartItems, wishlistData } = await getCartAndWishlistData();

  return (
    <>
      <CartPageClient cartItems={cartItems} />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistDataStateSetter wishlistData={wishlistData} />
    </>
  );
}
