import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/queryBuilder/buildQuery';

export async function fetchOrdersForUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, orderStatus, orderItems(orderItemId, quantity, size, pricePaid, product: products(productId, name, category, returnInfo, productImageData(imageUrl))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode), ...pendingCheckoutSessions(pendingCheckoutSessionId: sessionId)'
    )
    .eq('userId', authUser?.id ?? '')
    .eq('orderItems.products.productImageData.index', 0)
    .order('createdAt', { ascending: false });

  return orders;
}

export async function fetchOrdersForAdmin(
  page: QueryPageDataGrid,
  sort: QuerySortDataGrid,
  filter: QueryFilterDataGrid
) {
  const supabase = await createSupabaseServerClient();

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
    return {
      success: false,
      message: error.message,
      data: { orders: null, totalRowCount: count ?? 0 },
    };
  }

  return {
    success: true,
    message: 'Success!',
    data: { orders, totalRowCount: count ?? 0 },
  };
}
