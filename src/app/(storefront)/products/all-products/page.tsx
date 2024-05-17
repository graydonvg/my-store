import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getAllProducts } from '@/services/products/get';

export default async function AllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <>
      <PageHeaderWithBorder label="All Products" />
      {products ? <Products products={products} /> : null}
    </>
  );
}
