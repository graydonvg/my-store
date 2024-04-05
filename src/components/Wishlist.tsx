import { Grid } from '@mui/material';
import ProductCard from './ui/productCard/ProductCard';
import { WishlistItemType } from '@/types';

type Props = {
  wishlist: WishlistItemType[] | null;
};

export default function Wishlist({ wishlist }: Props) {
  return (
    <Grid
      component="ul"
      container
      spacing={{ xs: 2, sm: 3 }}>
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
            imageSizes="(min-width: 1200px) 172px, (min-width: 600px) calc(25vw - 30px), calc(50vw - 24px)"
          />
        </Grid>
      ))}
    </Grid>
  );
}
