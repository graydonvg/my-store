import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function getCartAndWishlistData() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      cartItems: null,
      wishlistData: null,
    };
  }

  const { data, error } = await supabase
    .from('users')
    .select(
      'wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, index)))'
    )
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: true, referencedTable: 'cart' });

  if (error) {
    return {
      cartItems: null,
      wishlistData: null,
    };
  }

  const { cart, wishlist } = data[0];

  return {
    cartItems: cart,
    wishlistData: wishlist,
  };
}
