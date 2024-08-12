import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { getProductsByCategory } from '@/services/products/get';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Kid's Fashion | ${CONSTANTS.STORE_NAME}`,
};

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
