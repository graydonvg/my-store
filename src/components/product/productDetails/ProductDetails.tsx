import { Product } from '@/types';
import { Box, Divider, Grid } from '@mui/material';
import ProductImageBoxes from '../productImageBoxes/ProductImageBoxes';
import ProductSelectionOptions from './productSelectionOptions/ProductSelectionOptions';
import BottomProductDetails from './bottomProductDetails/BottomProductDetails';
import TopProductDetails from './TopProductDetails';

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  return (
    <Grid
      container
      columnSpacing={4}
      rowSpacing={2}
      sx={{ height: 1 }}>
      <Grid
        item
        xs={12}
        md={6}>
        <ProductImageBoxes product={product} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}>
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
      </Grid>
    </Grid>
  );
}
