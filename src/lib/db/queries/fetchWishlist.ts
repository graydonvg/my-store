import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function fetchWishlist() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('wishlist')
    .select('wishlistItemId, size, product: products(*, productImageData(fileName, imageUrl, productImageId, index))')
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: true });

  const wishlist = data?.map((item) => {
    return {
      wishlistItemId: item.wishlistItemId,
      size: item.size,
      product: item.product!,
    };
  });

  return wishlist;
}
