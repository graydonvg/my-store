import Products from '@/components/product/Products';
import ProductsSidebar from '@/components/productsPageStorefront/productsSidebar/ProductsSidebar';
import PageHeaderWithBorder from '@/components/PageHeaderWithBorder';
import { Product, ProductsFilterOptions } from '@/types';
import { Box, Container } from '@mui/material';

type Props = {
  header: string;
  filterOptions: ProductsFilterOptions[] | null;
  products: Product[] | null;
};

export default function ProductsLayout({ header, filterOptions, products }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 122,
          left: 0,
          flexBasis: '240px',
          flexShrink: 0,
          maxHeight: '870px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: { xs: 'none', md: 'block' },
          scrollbarWidth: 'thin',
        }}>
        <ProductsSidebar filterOptions={filterOptions} />
      </Box>

      <Container
        component="main"
        disableGutters>
        <PageHeaderWithBorder label={header} />
        {products ? <Products products={products} /> : 'No results.'}
      </Container>
    </Box>
  );
}
