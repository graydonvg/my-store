import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import buildQuery from '@/utils/queryBuilder/buildQuery';

export async function getOrdersForUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, orderStatus, orderItems(orderItemId, quantity, size, pricePaid, product: products(productId, name, category, returnInfo, productImageData(imageUrl, index))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode)'
    )
    .eq('userId', authUser?.id ?? '')
    .order('createdAt', { ascending: false });

  return orders;
}

export async function getOrdersForAdmin(page: QueryPageDataGrid, sort: QuerySortDataGrid, filter: QueryFilterDataGrid) {
  const supabase = await createSupabaseServerClient();

  // const {
  //   data: { user: authUser },
  // } = await supabase.auth.getUser();

  let ordersQuery = supabase
    .from('orders')
    .select(
      'createdAt, orderId, orderTotal, orderStatus, ...users(firstName, lastName, contactNumber), ...shippingDetails(province, city, recipientFirstName, recipientLastName, recipientContactNumber)',
      {
        count: 'exact',
      }
    );
  // .neq('userId', authUser?.id);

  const builtOrdersQuery = buildQuery(ordersQuery, page, sort, filter);

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
