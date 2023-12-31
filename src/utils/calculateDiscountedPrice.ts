import { ProductType } from '@/types';

export function calculateDiscountedPrice(product: ProductType) {
  return product?.price - product?.price * (product?.sale_percentage / 100);
}
