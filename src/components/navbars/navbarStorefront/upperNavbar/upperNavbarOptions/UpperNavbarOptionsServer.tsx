import { Box } from '@mui/material';
import UnauthenticatedUpperNavbarOptions from './UnauthenticatedUpperNavbarOptions';
import getAuthUserData from '@/lib/db/queries/getAuthUserData';
import AuthenticatedUpperNavbarOptions from './AuthenticatedUpperNavbarOptions';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';

export default async function UpperNavbarOptionsServer() {
  const { authUser, userData, cartItems, wishlistData } = await getAuthUserData();

  return (
    <>
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {!authUser ? <UnauthenticatedUpperNavbarOptions /> : <AuthenticatedUpperNavbarOptions />}
      </Box>
      <UserStateSetter userData={userData} />
      <CartItemsStateSetter cartItems={cartItems} />
      <WishlistDataStateSetter wishlistData={wishlistData} />
    </>
  );
}
