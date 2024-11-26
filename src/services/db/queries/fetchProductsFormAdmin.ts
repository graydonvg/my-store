import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/dataGridQueryBuilder/buildQuery';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function fetchProductsForAdmin(
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchProductsForAdmin' });
  logger.info('Fetching products for admin');

  try {
    let productsQuery = supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)', {
        count: 'exact',
      })
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true });

    const builtProductsQuery = buildQuery('products', productsQuery, page, sort, filter);

    const { data: products, count, error } = await builtProductsQuery;

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return {
        success: false,
        message: error.message,
        data: { products: null, totalRowCount: count ?? 0 },
      };
    }

    logger.info('Fetched products for admin successfully');

    return {
      success: true,
      message: 'Success!',
      data: { products, totalRowCount: count ?? 0 },
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: { products: null, totalRowCount: 0 },
    };
  } finally {
    await logger.flush();
  }
}
