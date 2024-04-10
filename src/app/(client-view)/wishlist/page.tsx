import Wishlist from '@/components/Wishlist';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import getWishlist from '@/lib/db/queries/getWishlist';
import { Box } from '@mui/material';

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <Box>
      <PageHeaderWithBorder label="Wishlist" />
      {wishlist ? <Wishlist wishlist={wishlist} /> : null}
    </Box>
  );
}
