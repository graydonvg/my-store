import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function getInitialUserData() {
  const supabase = await createSupabaseServerClient();
  let userTableData = null;
  let cartItems = null;
  let wishlistItems = null;

  const {
    data: { user: userAuthData },
  } = await supabase.auth.getUser();

  const { data: userDataArray } = await supabase
    .from('users')
    .select(
      '*, admins(userId), addresses(*), wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
    )
    .order('createdAt', { ascending: false, referencedTable: 'addresses' })
    .order('createdAt', { ascending: false, referencedTable: 'cart' });

  if (userDataArray && userDataArray[0]) {
    const { cart, wishlist, admins, ...restOfUserData } = userDataArray[0];

    if (admins && admins[0] && admins[0].userId === userAuthData?.id) {
      userTableData = { ...restOfUserData, isAdmin: true };
    } else {
      userTableData = { ...restOfUserData, isAdmin: false };
    }

    cartItems = cart;
    wishlistItems = wishlist;
  }

  return { userAuthData, userTableData, cartItems, wishlistItems };
}
