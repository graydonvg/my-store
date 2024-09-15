import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { getAllProducts } from '@/services/products/get';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `All Products | ${CONSTANTS.STORE_NAME}`,
};

// type Props = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

export default async function AllProductsPage() {
  const { data: products } = await getAllProducts();

  return (
    <>
      <PageHeaderWithBorder label="All Products" />
      {products ? <Products products={products} /> : 'No results.'}
    </>
  );
}
