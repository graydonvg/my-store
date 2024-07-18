import HeroSection from '@/components/homePage/HeroSection';
import ShopByCategorySection from '@/components/homePage/ShopByCategorySection';
import ProductPreviewSection from '@/components/homePage/productPreviewSection/ProductPreviewSection';
import { getLimitedLatestProducts, getLimitedProductsOnSale } from '@/services/products/get';
import { Box } from '@mui/material';

export default async function HomePage() {
  const { data: saleProducts } = await getLimitedProductsOnSale();
  const { data: latestProducts } = await getLimitedLatestProducts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <HeroSection />
      <ProductPreviewSection
        productsOnSale={saleProducts ?? []}
        latestArrivals={latestProducts ?? []}
      />
      <ShopByCategorySection />
    </Box>
  );
}
