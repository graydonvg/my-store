import HeroSection from '@/components/homePage/HeroSection';
import ProductPreviewSection from '@/components/homePage/productPreviewSection/ProductPreviewSection';
import ShopByCategorySection from '@/components/homePage/shopByCategorySection/ShopByCategorySection';
import { STORE_NAME } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { fetchHomePageProductsDynamic } from '@/services/db/queries/fetchProductsDynamic';
import { getHomePageProductsCached } from '@/services/products/get';
import { getUserRoleFromSession } from '@/utils/auth';
import { Box } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Home | ${STORE_NAME}`,
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const userRole = await getUserRoleFromSession(supabase);

  // Products NOT CREATED BY THE OWNER are restricted and require auth to fetch from db
  const { data } = !userRole ? await getHomePageProductsCached() : await fetchHomePageProductsDynamic();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <HeroSection />
      <ProductPreviewSection
        productsOnSale={data?.limitedOnSaleProducts ?? []}
        latestArrivals={data?.limitedLatestProducts ?? []}
      />
      <ShopByCategorySection />
    </Box>
  );
}
