import { CartItemType, ProductType } from '@/types';

export function calculateDiscountedProductPrice(product: ProductType) {
  return product?.price - product?.price * (product?.sale_percentage / 100);
}

export function calculateDiscountedCartItemPrice(cartItem: CartItemType) {
  return cartItem?.product?.price! - cartItem?.product?.price! * (cartItem?.product?.sale_percentage! / 100);
}
