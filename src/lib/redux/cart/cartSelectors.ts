import { roundPrice } from '@/lib/utils';
import { CartItemType } from '@/types';

export function selectCartCount(items: CartItemType[]) {
  return items.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0);
}

export function selectTotalDiscount(items: CartItemType[]) {
  return items.reduce(
    (totalDiscount, item) =>
      totalDiscount +
      (item?.product?.on_sale
        ? roundPrice((item?.product?.price as number) * ((item?.product?.sale_percentage as number) / 100)) *
          item.quantity
        : 0),
    0
  );
}

export function selectOrderTotal(items: CartItemType[]) {
  return items.reduce((totalPrice, item) => totalPrice + item?.product?.price! * item?.quantity!, 0);
}

export function selectDeliveryFee(items: CartItemType[]) {
  return selectOrderTotal(items) - selectTotalDiscount(items) > 500 ? 0 : 60;
}

export function selectTotalToPay(items: CartItemType[]) {
  return selectOrderTotal(items) - selectTotalDiscount(items);
}
