import { getAllProducts } from '@/services/products/get';
import ProductsPageAdminPanelClient from '@/components/adminPanel/productsPageAdminPanel/ProductsPageAdminPanelClient';

export default async function ProductsPageAdminPanel() {
  const { data: products } = await getAllProducts();

  return <>{products ? <ProductsPageAdminPanelClient products={products} /> : null}</>;
}
