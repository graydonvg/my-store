import PageHeaderWithBorder from '@/components/PageHeaderWithBorder';
import ProductCard from '@/components/product/productCard/ProductCard';
import { STORE_NAME } from '@/constants';
import fetchWishlist from '@/services/db/queries/fetchWishlist';
import { Grid2 } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${STORE_NAME} - Wishlist`,
};

export default async function WishlistPage() {
  const wishlist = await fetchWishlist();

  return (
    <>
      <PageHeaderWithBorder label="Wishlist" />
      {wishlist ? (
        <Grid2
          component="ul"
          container
          spacing={{ xs: 2, md: 3 }}>
          {wishlist.map((item) => (
            <Grid2
              component="li"
              key={item.wishlistItemId}
              size={{ xs: 6, sm: 3, lg: 2 }}>
              <ProductCard
                product={item.product}
                wishlistSize={item.size}
                wishlistItemId={item.wishlistItemId}
                imageSizes="(min-width: 1200px) 172px, (min-width: 600px) calc(25vw - 27px), calc(50vw - 24px)"
              />
            </Grid2>
          ))}
        </Grid2>
      ) : null}
    </>
  );
}
