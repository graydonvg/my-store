import { CartItem, Product } from '@/types';

export function calculateDiscountedProductPrice(product: Product) {
  return product?.price - product?.price * (product?.salePercentage / 100);
}

export function calculateDiscountedCartItemPrice(cartItem: CartItem) {
  return cartItem?.product?.price! - cartItem?.product?.price! * (cartItem?.product?.salePercentage! / 100);
}
