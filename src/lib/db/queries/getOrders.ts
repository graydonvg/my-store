import getServiceSupabase from '@/lib/supabase/getServiceSupabase';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { OrdersSortByOptions } from '@/types';
import getOrdersSortBy from '@/utils/getOrdersSortBy';
import getOrdersSortOptions from '@/utils/getOrdersSortOptions';

export async function getOrdersForUser() {
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'createdAt, orderId, cartTotal, discountTotal, deliveryFee, orderTotal, isPaid, orderItems(orderItemId, quantity, size, pricePaid, product: products(productId, name, category, returnInfo, productImageData(imageUrl, index))), shippingDetails(recipientFirstName, recipientLastName, recipientContactNumber, complexOrBuilding, streetAddress, suburb, province, city, postalCode)'
    )
    .order('createdAt', { ascending: false });

  return orders;
}

export async function getOrdersForAdmin(
  start: number,
  end: number,
  sortBy: OrdersSortByOptions,
  sortDirection: 'asc' | 'desc'
) {
  const supabase = getServiceSupabase();
  const sortOrdersBy = getOrdersSortBy(sortBy);
  const sortOptions = getOrdersSortOptions(sortBy, sortDirection);

  const { data: orders, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .select('createdAt, orderId, orderTotal, user: users(firstName, lastName), shippingDetails(province, city)')
    .order(sortOrdersBy, sortOptions)
    .range(start, end);

  const totalCount = count ?? 0;

  return { orders, totalCount };
}
