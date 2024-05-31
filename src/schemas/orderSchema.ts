import { z } from 'zod';

const OrderItemSizesSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);

const OrderStatusSchema = z.enum([
  'awaiting payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
]);

const OrderShippingDetailsSchema = z
  .object({
    recipientFirstName: z.string().min(1),
    recipientLastName: z.string().min(1),
    recipientContactNumber: z.string().min(1),
    complexOrBuilding: z.string().nullable(),
    streetAddress: z.string().min(1),
    suburb: z.string().min(1),
    province: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.number(),
  })
  .strict();

const OrderItemSchema = z
  .object({
    pricePaid: z.number().positive(),
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: OrderItemSizesSchema,
  })
  .strict();

const OrderDetailsSchema = z
  .object({
    cartTotal: z.number().positive(),
    deliveryFee: z.number().nonnegative(),
    discountTotal: z.number().positive(),
    orderTotal: z.number().positive(),
    orderStatus: OrderStatusSchema,
  })
  .strict();

export const InsertOrderSchema = z
  .object({
    orderDetails: OrderDetailsSchema,
    orderItems: z.array(OrderItemSchema).nonempty(),
    shippingDetails: OrderShippingDetailsSchema,
  })
  .strict();
