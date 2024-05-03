import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import getUserRoleFromSession from '@/utils/getUserRoleFromSession';

export default async function getInitialUserData() {
  const supabase = await createSupabaseServerClient();
  let userData = null;
  let cartItems = null;
  let wishlistData = null;

  const {
    data: { user: userAuth },
  } = await supabase.auth.getUser();

  // Get user data only if auth user exists
  const { data: userDataArray } = userAuth
    ? await supabase
        .from('users')
        .select(
          '*, addresses(*), wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
        )
        .eq('userId', userAuth?.id)
        .order('createdAt', { ascending: false, referencedTable: 'addresses' })
        .order('createdAt', { ascending: false, referencedTable: 'cart' })
    : { data: null };

  if (userDataArray && userDataArray[0]) {
    const role = await getUserRoleFromSession(supabase);

    const { cart, wishlist, ...restOfUserData } = userDataArray[0];

    const isOAuthSignIn = userAuth?.app_metadata.provider !== 'email';

    cartItems = cart;
    wishlistData = wishlist;
    userData = { ...restOfUserData, isOAuthSignIn, role };
  }

  return { userData, cartItems, wishlistData };
}
