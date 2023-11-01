import Products from '@/components/Products';
import RevalidateButton from '@/components/RevalidateButton';
import getURL from '@/lib/utils';
import { Box } from '@mui/material';

export default async function AdminView() {
  const url = getURL('/api/products/get');
  const response = await fetch(url, {
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
