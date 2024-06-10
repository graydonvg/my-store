import { z } from 'zod';

const cartItemSizesSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);

export const insertCartItemSchema = z
  .object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
    size: cartItemSizesSchema,
  })
  .strict();
