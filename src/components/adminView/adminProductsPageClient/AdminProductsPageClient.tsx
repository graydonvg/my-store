'use client';

import Products from '@/components/Products';
import RevalidateButton from '@/components/adminView/adminProductsPageClient/RevalidateButton';
import AddNewProductButton from '@/components/adminView/adminProductsPageClient/AddNewProductButton';
import { Box, useTheme } from '@mui/material';
import { ProductType } from '@/types';

type Props = {
  products: ProductType[];
};

export default function AdminProductsPageClient({ products }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        padding: { xs: 2, md: 3 },
        borderRadius: 0,
        backgroundColor: darkMode ? theme.palette.background.default : theme.palette.background.paper,
      }}>
      <RevalidateButton />
      <Products products={products} />
      <AddNewProductButton />
    </Box>
  );
}
