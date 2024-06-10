import { z } from 'zod';

const noNumbersInString = z
  .string()
  .min(1)
  .refine((value) => !/\d/.test(value), {
    message: 'String must not contain numbers',
  });

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

export const ordersDataGridNewRowSchema = z.object({
  recipientFirstName: z.string().min(1),
  recipientLastName: z.string().min(1),
  recipientContactNumber: z.string().min(1),
  complexOrBuilding: z.string().nullable(),
  streetAddress: z.string().min(1),
  suburb: noNumbersInString,
  province: noNumbersInString,
  city: noNumbersInString,
  postalCode: z.number().int().min(1000).max(9999),
  orderStatus: orderStatusSchema,
  orderTotal: z.number().positive(),
});
