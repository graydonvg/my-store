import Products from '@/components/Products';
import RevalidateButton from '@/components/ui/buttons/RevalidateButton';
import AddNewProductButton from '@/components/ui/buttons/AddNewProductButton';
import { getAllProducts } from '@/services/products/get';
import { Box } from '@mui/material';

export default async function AdminViewAllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RevalidateButton />
      {products ? <Products products={products} /> : null}
      <AddNewProductButton />
    </Box>
  );
}
