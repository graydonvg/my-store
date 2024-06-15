import HeroSection from '@/components/homePage/HeroSection';
import ShopByCategorySection from '@/components/homePage/ShopByCategorySection';
import ProductPreviewSection from '@/components/homePage/productPreviewSection/ProductPreviewSection';
import { getAllProducts, getProductsOnSale } from '@/services/products/get';
import { Box } from '@mui/material';

export default async function HomePage() {
  const { data: allProducts } = await getAllProducts();
  const { data: saleProducts } = await getProductsOnSale();

  const productsOnSale = saleProducts?.slice(0, 3) ?? [];
  const latestArrivals = allProducts?.slice(0, 3) ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <HeroSection />
      <ProductPreviewSection
        latestArrivals={latestArrivals}
        productsOnSale={productsOnSale}
      />
      <ShopByCategorySection />
    </Box>
  );
}
