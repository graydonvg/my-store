import { Box } from '@mui/material';
import UnauthenticatedUpperNavbarOptions from './UnauthenticatedUpperNavbarOptions';
import getAuthUserData from '@/lib/db/queries/getAuthUserData';
import AuthenticatedUpperNavbarOptions from './AuthenticatedUpperNavbarOptions';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';
import AddressesStateSetter from '@/components/stateSetters/AddressesStateSetter';

export default async function UpperNavbarOptionsServer() {
  const { authUser, userData, addresses, cartItems, wishlistData } = await getAuthUserData();

  return (
    <>
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {!authUser ? <UnauthenticatedUpperNavbarOptions /> : <AuthenticatedUpperNavbarOptions />}
      </Box>
      <UserStateSetter userData={userData} />
      <AddressesStateSetter addresses={addresses} />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistDataStateSetter wishlistData={wishlistData} />
    </>
  );
}
