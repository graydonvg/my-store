import HomePageClient from '@/components/HomePageClient';
import { getAllProducts, getProductsOnSale } from '@/services/products/get';

export default async function Home() {
  const { data: allProducts } = await getAllProducts();
  const { data: saleProducts } = await getProductsOnSale();

  return (
    <HomePageClient
      allProducts={allProducts}
      saleProducts={saleProducts}
    />
  );
}
