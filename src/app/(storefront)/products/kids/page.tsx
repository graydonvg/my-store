import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsByCategory } from '@/services/products/get';

export default async function KidsProductsPage() {
  const category = 'Kids';
  const { data: products } = await getProductsByCategory(category);

  return (
    <>
      <PageHeaderWithBorder label={category} />
      {products ? <Products products={products} /> : 'No results.'}
    </>
  );
}
