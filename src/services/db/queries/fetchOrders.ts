import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/dataGridQueryBuilder/buildQuery';
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
  logger.info('Attempting to fetch orders for user');

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
      .order('orderId', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (ordersError) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: ordersError });
      return { orders: null, totalRowCount: count ?? 0 };
    }

    logger.info('Fetched orders for user successfully');

    return { orders, totalRowCount: count ?? 0 };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
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
  logger.info('Attempting to fetch orders for admin');

  try {
    let ordersQuery = supabase
      .from('orders')
      .select(
        'createdAt, orderId, orderTotal, orderStatus, createdBy, ...users!inner(firstName, lastName, contactNumber), ...shippingDetails!inner(complexOrBuilding, streetAddress, suburb, province, city, postalCode, recipientFirstName, recipientLastName, recipientContactNumber)',
        {
          count: 'exact',
        }
      );

    const builtOrdersQuery = buildQuery('orders', ordersQuery, page, sort, filter);

    const { data: orders, count, error } = await builtOrdersQuery;

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
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
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: { orders: null, totalRowCount: 0 },
    };
  } finally {
    await logger.flush();
  }
}
