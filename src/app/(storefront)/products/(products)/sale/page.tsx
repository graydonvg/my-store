import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsOnSale } from '@/services/products/get';

export default async function SaleProductsPage() {
  const { data: products } = await getProductsOnSale();

  return (
    <>
      <PageHeaderWithBorder label="SALE" />
      {products ? <Products products={products} /> : 'No results.'}
    </>
  );
}
