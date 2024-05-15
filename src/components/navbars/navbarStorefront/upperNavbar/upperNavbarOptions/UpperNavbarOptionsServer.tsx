import { Box } from '@mui/material';
import AuthenticatedUserUpperNavbarOptions from './AuthenticatedUserUpperNavbarOptions';
import UserAuthenticationUpperNavbarOptions from './UserAuthenticationUpperNavbarOptions';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import AddressesStateSetter from '@/components/stateSetters/AddressesStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';
import getAuthUserData from '@/lib/db/queries/getAuthUserData';

export default async function UpperNavbarOptionsServer() {
  const { authUser, userData, addresses, cartItems, wishlistData } = await getAuthUserData();

  return (
    <>
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {!authUser ? <UserAuthenticationUpperNavbarOptions /> : <AuthenticatedUserUpperNavbarOptions />}
      </Box>
      <UserStateSetter userData={userData} />
      <AddressesStateSetter addresses={addresses} />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistDataStateSetter wishlistData={wishlistData} />
    </>
  );
}
