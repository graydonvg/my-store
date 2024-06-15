import { getAllProducts } from '@/services/products/get';
import { Box } from '@mui/material';
import RevalidateButton from '@/components/adminPanel/products/RevalidateButton';
import Products from '@/components/product/Products';
import AddNewProductButton from '@/components/adminPanel/products/AddNewProductButton';

export default async function AdminPanelProductsPage() {
  const { data: products } = await getAllProducts();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        padding: { xs: 2, md: 3 },
        borderRadius: 0,
      }}>
      <RevalidateButton />
      {products ? <Products products={products} /> : 'No results.'}
      <AddNewProductButton />
    </Box>
  );
}
