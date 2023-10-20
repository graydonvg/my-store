import Products from '@/components/Products';
import { getProductsFromDatabase } from '@/lib/firebase';

type AdminViewProps = {};

export default async function AdminView() {
  const categoriesAndProducts = await getProductsFromDatabase();
  return <Products categoriesAndProducts={categoriesAndProducts} />;
}
