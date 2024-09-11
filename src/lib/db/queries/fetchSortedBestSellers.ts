import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchSortedBestSellers() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchSortedBestSellers' });
  logger.info('Fetching best sellers');

  try {
    const { data: bestSellers } = await supabase.rpc('getBestSellers');

    let sortedBestSellers = null;

    if (bestSellers) {
      const bestSellerProductIds = bestSellers.map((item) => item.productId);

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('productId, name, category, productImageData(imageUrl)')
        .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
        .limit(1, { referencedTable: 'productImageData' })
        .in('productId', bestSellerProductIds);

      if (productsError) {
        logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: productsError });
        return null;
      }

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

    logger.info('Fetched best sellers successfully');

    return sortedBestSellers;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
