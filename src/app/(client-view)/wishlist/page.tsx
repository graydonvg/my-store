import Wishlist from '@/components/Wishlist';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Box } from '@mui/material';

export default async function WishlistPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('wishlist')
    .select(
      'wishlistItemId, size, product: products!inner(*, productImageData!inner(fileName, imageUrl, productImageId, index))'
    )
    .order('createdAt', { ascending: true });

  const wishlist = data?.map((item) => {
    return {
      wishlistItemId: item.wishlistItemId,
      size: item.size,
      product: item.product!,
    };
  });

  return (
    <Box>
      <PageHeaderWithBorder label="Wishlist" />
      {wishlist ? <Wishlist wishlist={wishlist} /> : null}
    </Box>
  );
}
