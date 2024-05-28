import { CartItem, OrderItem } from '@/types';
import { calculateRoundedDiscountedPrice } from '../calculate';

export function getLineItemsFromCartItems(cartItems: CartItem[]) {
  const lineItems = cartItems.map((item) => {
    const unitAmount =
      item?.product?.isOnSale === 'Yes'
        ? calculateRoundedDiscountedPrice(item.product.price, item.product.salePercentage)
        : item?.product?.price!;

    return {
      price_data: {
        currency: 'zar',
        product_data: {
          name: item.product?.name ?? '',
          images: [item.product?.productImageData[0].imageUrl ?? ''],
        },
        unit_amount: unitAmount * 100,
      },
      quantity: item?.quantity,
    };
  });

  return lineItems;
}

export function getLineItemsFromDatabaseOrderItems(orderItems: OrderItem[]) {
  const lineItems = orderItems.map((item) => {
    return {
      price_data: {
        currency: 'zar',
        product_data: {
          name: item.product?.name ?? '',
          images: [item.product?.productImageData[0].imageUrl ?? ''],
        },
        unit_amount: item.pricePaid * 100,
      },
      quantity: item?.quantity,
    };
  });

  return lineItems;
}
