import { getAllProducts } from '@/services/products/get';
import AdminProductsPageClient from '@/components/adminView/adminProductsPageClient/AdminProductsPageClient';

export default async function AdminViewAllProducts() {
  const { data: products } = await getAllProducts();

  return <>{products ? <AdminProductsPageClient products={products} /> : null}</>;
}
