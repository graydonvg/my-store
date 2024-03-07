import HomePageClient from '@/components/homePageClient/HomePageClient';
import { getAllProducts, getProductsOnSale } from '@/services/products/get';

export default async function HomePage() {
  const { data: allProducts } = await getAllProducts();
  const { data: saleProducts } = await getProductsOnSale();

  return (
    <main>
      <HomePageClient
        allProducts={allProducts}
        saleProducts={saleProducts}
      />
    </main>
  );
}
