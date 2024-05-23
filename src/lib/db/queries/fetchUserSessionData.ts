import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleFromSession } from '@/utils/getUserRole';

export default async function fetchUserSessionData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const role = await getUserRoleFromSession(supabase);

  const { data: userDataArray } = await supabase
    .from('users')
    .select(
      '*, wishlist( productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
    )
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: true, referencedTable: 'cart' });

  if (!userDataArray || !userDataArray[0]) {
    return {
      authUser,
      userData: null,
      cartItems: null,
      wishlistData: null,
    };
  }

  const { cart, wishlist, ...restOfUserData } = userDataArray[0];

  const isOAuthSignIn = authUser?.app_metadata.provider !== 'email';

  return {
    authUser,
    userData: { ...restOfUserData, isOAuthSignIn, role },
    cartItems: cart,
    wishlistData: wishlist,
  };
}
