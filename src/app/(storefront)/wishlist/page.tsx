import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import ProductCard from '@/components/product/productCard/ProductCard';
import getWishlist from '@/lib/db/queries/getWishlist';
import { Box, Grid } from '@mui/material';

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <Box>
      <PageHeaderWithBorder label="Wishlist" />
      {wishlist ? (
        <Grid
          component="ul"
          container
          spacing={{ xs: 2, md: 3 }}>
          {wishlist?.map((item, index) => (
            <Grid
              component="li"
              key={index}
              item
              xs={6}
              sm={3}
              lg={2}>
              <ProductCard
                product={item.product}
                wishlistSize={item.size}
                wishlistItemId={item.wishlistItemId}
                imageSizes="(min-width: 1200px) 292px, (min-width: 900px) 452px, (min-width: 600px) 340px, (min-width: 420px) 456px, 304px"
              />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}
