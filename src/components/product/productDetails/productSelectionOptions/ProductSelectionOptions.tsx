import { Product } from '@/types';
import { Box } from '@mui/material';
import QuantityPickerProductDetails from './QuantityPickerProductDetails';
import AddToCartButton from './AddToCartButton';
import { useAppSelector } from '@/lib/redux/hooks';
import SizePickerProductDetails from './SizePickerProductDetails';
import AddToWishlistButton from './AddToWishlistButton';

type Props = {
  product: Product;
};

export default function ProductSelectionOptions({ product }: Props) {
  const size = useAppSelector((state) => state.productSelectionDetails.size);

  return (
    <>
      <SizePickerProductDetails product={product} />
      {size ? <QuantityPickerProductDetails /> : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
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
