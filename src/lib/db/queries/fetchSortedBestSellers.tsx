import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function fetchSortedBestSellers() {
  const supabase = await createSupabaseServerClient();

  const { data: bestSellers } = await supabase.rpc('getBestSellers');

  let sortedBestSellers = null;

  if (bestSellers) {
    const bestSellerProductIds = bestSellers.map((item) => item.productId);

    const { data: products } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .in('productId', bestSellerProductIds);

    if (products) {
      sortedBestSellers = products
        .map((product) => {
          const totalQuantitySold =
            bestSellers.find((item) => item.productId === product.productId)?.totalQuantitySold ?? 0;

          return {
            ...product,
            totalQuantitySold,
          };
        })
        .sort((a, b) => (b.totalQuantitySold ?? 0) - (a.totalQuantitySold ?? 0));
    }
  }

  return sortedBestSellers;
}
