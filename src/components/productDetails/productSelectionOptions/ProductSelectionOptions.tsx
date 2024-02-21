import { ProductType } from '@/types';
import { Box } from '@mui/material';
import QuantityPickerProductDetails from './QuantityPickerProductDetails';
import AddToCartButton from '../../ui/buttons/AddToCartButton';
import { useAppSelector } from '@/lib/redux/hooks';
import SizePickerProductDetails from './SizePickerProductDetails';
import AddToWishlistButton from '../../ui/buttons/AddToWishlistButton';

type Props = {
  product: ProductType;
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
        <AddToWishlistButton />
      </Box>
    </>
  );
}
