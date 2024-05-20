import { Product } from '@/types';
import { Box } from '@mui/material';
import ProductDetailsQuantityPicker from './ProductDetailsQuantityPicker';
import AddToCartButton from './AddToCartButton';
import { useAppSelector } from '@/lib/redux/hooks';
import ProductDetailsSizePicker from './ProductDetailsSizePicker';
import AddToWishlistButton from './AddToWishlistButton';

type Props = {
  product: Product;
};

export default function ProductSelectionOptions({ product }: Props) {
  const size = useAppSelector((state) => state.productSelectionDetails.size);

  return (
    <>
      <ProductDetailsSizePicker product={product} />
      {size ? <ProductDetailsQuantityPicker /> : null}
      <Box
        sx={{
          display: 'flex',
          // flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          paddingY: 4,
        }}>
        <AddToCartButton product={product} />
        <AddToWishlistButton
          product={product}
          size={size}
        />
      </Box>
    </>
  );
}
