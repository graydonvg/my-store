import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleFromSession } from '@/utils/getUserRole';

export default async function getAuthUserData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      authUser: null,
      userData: null,
      cartItems: null,
      wishlistData: null,
    };
  }

  const role = await getUserRoleFromSession(supabase);

  // Get user data only if auth user exists
  const { data: userDataArray } = await supabase
    .from('users')
    .select(
      '*, addresses(*), wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
    )
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: false, referencedTable: 'addresses' })
    .order('createdAt', { ascending: false, referencedTable: 'cart' });

  if (!userDataArray) {
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
