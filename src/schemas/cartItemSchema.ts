import { z } from 'zod';

const CartItemSizesSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);

export const InsertCartItemSchema = z
  .object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: CartItemSizesSchema,
  })
  .strict();
