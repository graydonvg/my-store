import HomePageClient from '@/components/HomePageClient';
import { getAllProducts } from '@/services/products/get';

export default async function Home() {
  const { data: products } = await getAllProducts();

  return <HomePageClient products={products} />;
}
