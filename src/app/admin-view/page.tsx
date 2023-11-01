import Products from '@/components/Products';
import RevalidateButton from '@/components/RevalidateButton';
import { Box } from '@mui/material';

export default async function AdminView() {
  const response = await fetch('http://localhost:3000/api/products/get', {
    cache: 'force-cache',
  });
  const products = await response.json();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RevalidateButton />
      <Products products={products ?? []} />;
    </Box>
  );
}
