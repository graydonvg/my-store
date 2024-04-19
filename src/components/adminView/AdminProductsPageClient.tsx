'use client';

import Products from '@/components/Products';
import RevalidateButton from '@/components/ui/buttons/RevalidateButton';
import AddNewProductButton from '@/components/ui/buttons/AddNewProductButton';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { BORDER_RADIUS } from '@/config';
import { ProductType } from '@/types';

type Props = {
  products: ProductType[];
};

export default function AdminProductsPageClient({ products }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={isBelowSmall ? 0 : 1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        padding: { xs: 2, md: 3 },
        borderRadius: { xs: 0, sm: BORDER_RADIUS },
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
      }}>
      <RevalidateButton />
      <Products products={products} />
      <AddNewProductButton />
    </Paper>
  );
}
