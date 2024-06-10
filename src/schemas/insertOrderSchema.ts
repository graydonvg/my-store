import { z } from 'zod';

const orderItemSizesSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);

const orderStatusSchema = z.enum([
  'awaiting payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
]);

const orderShippingDetailsSchema = z
  .object({
    recipientFirstName: z.string().min(1),
    recipientLastName: z.string().min(1),
    recipientContactNumber: z.string().min(1),
    complexOrBuilding: z.string().nullable(),
    streetAddress: z.string().min(1),
    suburb: z.string().min(1),
    province: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.number().int().min(1000).max(9999),
  })
  .strict();

const orderItemSchema = z
  .object({
    pricePaid: z.number().positive(),
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: orderItemSizesSchema,
  })
  .strict();

const orderDetailsSchema = z
  .object({
    cartTotal: z.number().positive(),
    deliveryFee: z.number().nonnegative(),
    discountTotal: z.number().nonnegative(),
    orderTotal: z.number().positive(),
    orderStatus: orderStatusSchema,
  })
  .strict();

export const insertOrderSchema = z
  .object({
    orderDetails: orderDetailsSchema,
    orderItems: z.array(orderItemSchema).nonempty(),
    shippingDetails: orderShippingDetailsSchema,
  })
  .strict();
