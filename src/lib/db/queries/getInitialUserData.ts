import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function getInitialUserData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: userAuthData },
  } = await supabase.auth.getUser();

  const { data: userDataArray } = await supabase
    .from('users')
    .select(
      '*, admins(userId), managers(userId), addresses(*), wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
    )
    .order('createdAt', { ascending: false, referencedTable: 'addresses' })
    .order('createdAt', { ascending: false, referencedTable: 'cart' });

  let userData = null;
  let cartItems = null;
  let wishlistData = null;

  if (userDataArray && userDataArray[0]) {
    const { cart, wishlist, admins, managers, ...restOfUserData } = userDataArray[0];

    const isAdmin = admins[0]?.userId === userAuthData?.id;
    const isManager = managers[0]?.userId === userAuthData?.id;
    const isOAuthSignIn = userAuthData?.app_metadata.provider !== 'email';

    let authLevel = 0;

    if (isAdmin) {
      authLevel = 1;
    } else if (isManager) {
      authLevel = 2;
    }

    userData = { ...restOfUserData, isOAuthSignIn, authLevel };
    cartItems = cart;
    wishlistData = wishlist;
  }

  return { userData, cartItems, wishlistData };
}
