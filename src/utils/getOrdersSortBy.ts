import { OrdersSortByOptions } from '@/types';

export default function getOrdersSortBy(option: OrdersSortByOptions) {
  const options = {
    date: 'createdAt',
    sale_amount: 'orderTotal',
    name: 'lastName',
    ship_to: 'province',
  };

  return options[option];
}
