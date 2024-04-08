import Products from '@/components/Products';
import RevalidateButton from '@/components/ui/buttons/RevalidateButton';
import AddNewProductButton from '@/components/ui/buttons/AddNewProductButton';
import { getAllProducts } from '@/services/products/get';
import { Box, Paper } from '@mui/material';
import { BORDER_RADIUS } from '@/config';

export default async function AdminViewAllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'white' }}>
      {/* <Paper sx={{ padding: 2, borderRadius: BORDER_RADIUS }}> */}
      <RevalidateButton />
      {/* </Paper> */}
      {products ? (
        // <Paper sx={{ padding: 2, borderRadius: BORDER_RADIUS }}>
        <Products products={products} />
      ) : // </Paper>
      null}
      <AddNewProductButton />
    </Box>
  );
}
