import { OrdersSortByOptions } from '@/types';

export default function getOrdersSortOptions(sortOrdersBy: OrdersSortByOptions, sortDirection: 'asc' | 'desc') {
  let sortOptions: { referencedTable: 'users' | 'shippingDetails' | null; ascending: boolean };

  sortOptions = { referencedTable: null, ascending: sortDirection === 'asc' ? true : false };

  if (sortOrdersBy === 'name') {
    sortOptions.referencedTable = 'users';
  } else if (sortOrdersBy === 'ship_to') {
    sortOptions.referencedTable = 'shippingDetails';
  }

  return sortOptions;
}
