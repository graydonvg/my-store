import HeroSection from '@/components/homePage/HeroSection';
import ProductPreviewSection from '@/components/homePage/productPreviewSection/ProductPreviewSection';
import ShopByCategorySection from '@/components/homePage/shopByCategorySection/ShopByCategorySection';
import { STORE_NAME } from '@/constants';

import { getLimitedLatestProducts, getLimitedProductsOnSale } from '@/services/products/get';
import { Box } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Home | ${STORE_NAME}`,
};

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
