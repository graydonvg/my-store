'use client';

import Products from '@/components/Products';
import RevalidateButton from '@/components/adminView/adminProductsPageClient/RevalidateButton';
import AddNewProductButton from '@/components/adminView/adminProductsPageClient/AddNewProductButton';
import { Box } from '@mui/material';
import { Product } from '@/types';

type Props = {
  products: Product[];
};

export default function AdminProductsPageClient({ products }: Props) {
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
      <Products products={products} />
      <AddNewProductButton />
    </Box>
  );
}
