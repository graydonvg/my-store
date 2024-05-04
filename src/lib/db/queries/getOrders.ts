import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AdminOrdersTableOrderData, OrderData, AdminOrdersDataGridSortableColumns } from '@/types';
import { getOrdersSortOptions } from '@/utils/getTableSortOptions';

export async function getOrdersForUser(): Promise<OrderData[] | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: userAuth },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, isPaid, orderItems(orderItemId, quantity, size, pricePaid, product: products(productId, name, category, returnInfo, productImageData(imageUrl, index))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode)'
    )
    .eq('userId', userAuth?.id ?? '')
    .order('createdAt', { ascending: false });

  return orders;
}

type OrdersForAdminReturnType = {
  orders: AdminOrdersTableOrderData[] | null;
  totalRowCount: number;
};

export async function getOrdersForAdmin(
  start: number,
  end: number,
  sortBy: AdminOrdersDataGridSortableColumns,
  sortDirection: 'asc' | 'desc'
): Promise<OrdersForAdminReturnType> {
  const supabase = await createSupabaseServerClient();
  const { sortOrdersBy, sortOptions } = getOrdersSortOptions(sortBy, sortDirection);

  let ordersQuery = supabase
    .from('orders')
    .select(
      'createdAt, orderId, orderTotal, isPaid, user: users(firstName, lastName), shippingDetails(province, city)',
      {
        count: 'exact',
      }
    );

  if (sortOrdersBy === 'lastName') {
    ordersQuery = ordersQuery.order(sortOrdersBy, sortOptions).order('firstName', sortOptions);
  } else {
    ordersQuery = ordersQuery.order(sortOrdersBy, sortOptions);
  }

  const { data: orders, count } = await ordersQuery.range(start, end);

  const totalRowCount = count ?? 0;

  return { orders, totalRowCount };
}
