import HomePageClient from '@/components/homePage/HomePageClient';
import { getAllProducts, getProductsOnSale } from '@/services/products/get';

export default async function HomePage() {
  const { data: allProducts } = await getAllProducts();
  const { data: saleProducts } = await getProductsOnSale();

  return (
    <HomePageClient
      allProducts={allProducts}
      saleProducts={saleProducts}
    />
  );
}
