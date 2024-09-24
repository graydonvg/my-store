import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/queryBuilder/buildQuery';
import { Logger } from 'next-axiom';

const log = new Logger();

type Params = {
  pageNumber: number;
  ordersPerPage: number;
};

export async function fetchOrdersForUser({ pageNumber, ordersPerPage }: Params) {
  const supabase = await createSupabaseServerClient();
  const rangeStart = (pageNumber - 1) * ordersPerPage;
  const rangeEnd = rangeStart + (ordersPerPage - 1);

  const logger = log.with({ context: 'dbQuery: fetchOrdersForUser' });
  logger.info('Fetching orders for user');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const {
      data: orders,
      error: ordersError,
      count,
    } = await supabase
      .from('orders')
      .select(
        'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, orderStatus, orderItems(orderItemId, quantity, size, pricePaid, product: products(productId, name, category, returnInfo, productImageData(imageUrl))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode), ...pendingCheckoutSessions(pendingCheckoutSessionId: sessionId)',
        {
          count: 'exact',
        }
      )
      .eq('userId', authUser?.id ?? '')
      .eq('orderItems.products.productImageData.imageIndex', 0)
      .order('createdAt', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (ordersError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: ordersError });
      return { orders: null, totalRowCount: count ?? 0 };
    }

    logger.info('Fetched orders for user successfully');

    return { orders, totalRowCount: count ?? 0 };
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return { orders: null, totalRowCount: 0 };
  } finally {
    await logger.flush();
  }
}

export async function fetchOrdersForAdmin(
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchOrdersForAdmin' });
  logger.info('Fetching orders for admin');

  try {
    let ordersQuery = supabase
      .from('orders')
      .select(
        'createdAt, orderId, orderTotal, orderStatus, ...users!inner(firstName, lastName, contactNumber), ...shippingDetails!inner(complexOrBuilding, streetAddress, suburb, province, city, postalCode, recipientFirstName, recipientLastName, recipientContactNumber)',
        {
          count: 'exact',
        }
      );

    const builtOrdersQuery = buildQuery('orders', ordersQuery, page, sort, filter);

    const { data: orders, count, error } = await builtOrdersQuery;

    if (error) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });
      return {
        success: false,
        message: error.message,
        data: { orders: null, totalRowCount: count ?? 0 },
      };
    }

    logger.info('Fetched orders for admin successfully');

    return {
      success: true,
      message: 'Success!',
      data: { orders, totalRowCount: count ?? 0 },
    };
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return {
      success: false,
      message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      data: { orders: null, totalRowCount: 0 },
    };
  } finally {
    await logger.flush();
  }
}
