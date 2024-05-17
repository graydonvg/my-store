import { CartItem } from '@/types';

export function selectCartCount(items: CartItem[]) {
  return items.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0);
}

export function selectPrice(item: CartItem) {
  return item?.product?.price! * item?.quantity!;
}

export function selectDiscountedPrice(item: CartItem) {
  return (item?.product?.price! - item?.product?.price! * (item?.product?.salePercentage! / 100)) * item?.quantity!;
}

export function selectDiscountTotal(items: CartItem[]) {
  return items.reduce(
    (discountTotal, item) =>
      discountTotal +
      (item?.product?.isOnSale === 'Yes'
        ? Math.round((item?.product?.price as number) * ((item?.product?.salePercentage as number) / 100)) *
          item.quantity
        : 0),
    0
  );
}

export function selectCartTotal(items: CartItem[]) {
  return items.reduce((totalPrice, item) => totalPrice + item?.product?.price! * item?.quantity!, 0);
}

export function selectDeliveryFee(items: CartItem[]) {
  return selectCartTotal(items) - selectDiscountTotal(items) > 500 ? 0 : 60;
}

export function selectOrderTotal(items: CartItem[]) {
  return selectCartTotal(items) - selectDiscountTotal(items);
}
