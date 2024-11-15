import { Product } from '@/types';
import { Box, Divider, Grid2 } from '@mui/material';
import ProductSelectionOptions from './productSelectionOptions/ProductSelectionOptions';
import BottomProductDetails from './bottomProductDetails/BottomProductDetails';
import TopProductDetails from './TopProductDetails';
import ProductImagesStorefront from '../productImages/ProductImagesStorefront';

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  return (
    <Grid2
      container
      columnSpacing={4}
      rowSpacing={2}
      sx={{ height: 1 }}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <ProductImagesStorefront
          productName={product.name}
          productImageData={product.productImageData}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: 2,
            }}>
            <TopProductDetails product={product} />
            <Divider />
          </Box>
          <ProductSelectionOptions product={product} />
          <Divider />
          <BottomProductDetails product={product} />
        </Box>
      </Grid2>
    </Grid2>
  );
}
