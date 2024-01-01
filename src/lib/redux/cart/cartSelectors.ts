import { CartItemType } from '@/types';

export function selectCartCount(items: CartItemType[]) {
  return items.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0);
}

export function selectQuantity(item: CartItemType) {
  return item?.quantity!;
}

export function selectPrice(item: CartItemType) {
  return item?.product?.price! * item?.quantity!;
}

export function selectDiscountedPrice(item: CartItemType) {
  return (item?.product?.price! - item?.product?.price! * (item?.product?.sale_percentage! / 100)) * item?.quantity!;
}

export function selectTotalDiscount(items: CartItemType[]) {
  return items.reduce(
    (totalDiscount, item) =>
      totalDiscount +
      (item?.product?.on_sale
        ? Math.round((item?.product?.price as number) * ((item?.product?.sale_percentage as number) / 100)) *
          item.quantity
        : 0),
    0
  );
}

export function selectCartTotal(items: CartItemType[]) {
  return items.reduce((totalPrice, item) => totalPrice + item?.product?.price! * item?.quantity!, 0);
}

export function selectDeliveryFee(items: CartItemType[]) {
  return selectCartTotal(items) - selectTotalDiscount(items) > 500 ? 0 : 60;
}

export function selectOrderTotal(items: CartItemType[]) {
  return selectCartTotal(items) - selectTotalDiscount(items);
}
