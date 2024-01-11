import Products from '@/components/Products';
import RevalidateButton from '@/components/RevalidateButton';
import { getAllProducts } from '@/services/products/get';
import { Box } from '@mui/material';

export default async function AdminViewAllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RevalidateButton />
      <Products
        show={!!products}
        products={products!}
      />
    </Box>
  );
}
