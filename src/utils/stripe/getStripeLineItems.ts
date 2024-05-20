import { CartItem, OrderItem } from '@/types';
import { calculateDiscountedCartItemPrice } from '../calculate';

export function getLineItemsFromCartItems(cartItems: CartItem[]) {
  const lineItems = cartItems.map((item) => {
    const unitAmount =
      item?.product?.isOnSale === 'Yes' ? calculateDiscountedCartItemPrice(item) : item?.product?.price!;
    const images = [...item?.product?.productImageData!]
      .filter((image) => image.index === 0)
      .map((image) => image.imageUrl);

    return {
      price_data: {
        currency: 'zar',
        product_data: {
          name: item.product!.name,
          images,
        },
        unit_amount: unitAmount * 100,
      },
      quantity: item?.quantity,
    };
  });

  return lineItems;
}

export function getLineItemsFromOrderItems(orderItems: OrderItem[]) {
  const lineItems = orderItems.map((item) => {
    const images = [...item.product?.productImageData!]
      .filter((image) => image.index === 0)
      .map((image) => image.imageUrl as string);

    return {
      price_data: {
        currency: 'zar',
        product_data: {
          name: item.product!.name,
          images,
        },
        unit_amount: item.pricePaid * 100,
      },
      quantity: item?.quantity,
    };
  });

  return lineItems;
}
