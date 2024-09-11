import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchRecentProducts() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchRecentProducts' });
  logger.info('Fetching recent products');

  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('productId, name, category, price, isOnSale, salePercentage, productImageData(imageUrl)')
      .order('createdAt', { ascending: false })
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .limit(1, { referencedTable: 'productImageData' })
      .limit(5);

    if (productsError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: productsError });
      return null;
    }

    logger.info('Fetched recent successfully');

    return products;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
