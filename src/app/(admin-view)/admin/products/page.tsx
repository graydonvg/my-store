import Products from '@/components/Products';
import RevalidateButton from '@/components/ui/buttons/RevalidateButton';
import AddNewProductButton from '@/components/ui/buttons/AddNewProductButton';
import { getAllProducts } from '@/services/products/get';
import { Paper } from '@mui/material';

export default async function AdminViewAllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, padding: { xs: 2, md: 3 } }}>
      <RevalidateButton />
      {products ? <Products products={products} /> : null}
      <AddNewProductButton />
    </Paper>
  );
}
