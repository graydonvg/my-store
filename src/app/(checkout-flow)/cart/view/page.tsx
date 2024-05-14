import CartPageClient from '@/components/checkoutFlow/CartPageClient';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';
import getAuthUserData from '@/lib/db/queries/getAuthUserData';

export default async function CartPage() {
  const { cartItems, wishlistData } = await getAuthUserData();

  return (
    <>
      <CartPageClient />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistDataStateSetter wishlistData={wishlistData} />
    </>
  );
}
