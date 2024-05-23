import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import ProductCard from '@/components/product/productCard/ProductCard';
import fetchWishlist from '@/lib/db/queries/fetchWishlist';
import { Box, Grid } from '@mui/material';

export default async function WishlistPage() {
  const wishlist = await fetchWishlist();

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
                imageSizes="(min-width: 1200px) 172px, (min-width: 600px) calc(25vw - 27px), calc(50vw - 24px)"
              />
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}
