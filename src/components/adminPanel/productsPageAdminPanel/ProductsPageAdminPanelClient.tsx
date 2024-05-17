'use client';

import Products from '@/components/product/Products';
import RevalidateButton from '@/components/adminPanel/productsPageAdminPanel/RevalidateButton';
import AddNewProductButtonAdminPanel from '@/components/adminPanel/productsPageAdminPanel/AddNewProductButtonAdminPanel';
import { Box } from '@mui/material';
import { Product } from '@/types';

type Props = {
  products: Product[];
};

export default function ProductsPageAdminPanelClient({ products }: Props) {
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
      <AddNewProductButtonAdminPanel />
    </Box>
  );
}
