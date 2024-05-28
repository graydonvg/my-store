import { getAllProducts } from '@/services/products/get';
import ProductsPageAdminPanelClient from '@/components/adminPanel/products/ProductsPageAdminPanelClient';

export default async function AdminPanelProductsPage() {
  const { data: products } = await getAllProducts();

  return <ProductsPageAdminPanelClient products={products} />;
}
