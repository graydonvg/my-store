import getInitialUserData from '@/lib/db/queries/getInitialUserData';
import CartItemsStateSetter from './CartItemsStateSetter';
import UserStateSetter from './UserStateSetter';
import WishlistStateSetter from './WishlistStateSetter';

type Props = {};

export default async function StateSetters() {
  const { userAuthData, userTableData, cartItems, wishlistItems } = await getInitialUserData();

  return (
    <>
      <UserStateSetter
        user={userAuthData}
        userData={userTableData}
      />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistStateSetter wishlistItems={wishlistItems} />
    </>
  );
}
