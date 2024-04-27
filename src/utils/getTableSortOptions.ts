import { OrdersSortByOptions } from '@/types';

export function getOrdersSortOptions(sortBy: OrdersSortByOptions, sortDirection: 'asc' | 'desc') {
  let sortOptions: { referencedTable: 'users' | 'shippingDetails' | null; ascending: boolean };
  sortOptions = { referencedTable: null, ascending: sortDirection === 'asc' ? true : false };

  const sortOrdersBy = {
    date: 'createdAt',
    order_total: 'orderTotal',
    name: 'lastName',
    ship_to: 'province',
    status: 'isPaid',
  };

  if (sortBy === 'name') {
    sortOptions.referencedTable = 'users';
  } else if (sortBy === 'ship_to') {
    sortOptions.referencedTable = 'shippingDetails';
  }

  return { sortOrdersBy: sortOrdersBy[sortBy], sortOptions };
}
