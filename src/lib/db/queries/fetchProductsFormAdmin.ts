import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/queryBuilder/buildQuery';
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
      .select(
        'productId, name, brand, category, price, isOnSale, salePercentage, productImageData(fileName, imageUrl)',
        {
          count: 'exact',
        }
      )
      .order('index', { referencedTable: 'productImageData', ascending: true })
      .limit(1, { referencedTable: 'productImageData' });

    const builtProductsQuery = buildQuery('products', productsQuery, page, sort, filter);

    const { data: products, count, error } = await builtProductsQuery;

    if (error) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });
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
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return {
      success: false,
      message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      data: { products: null, totalRowCount: 0 },
    };
  } finally {
    await logger.flush();
  }
}
