import { z } from 'zod';

const userRoleSchema = z.enum(['null', 'admin', 'manager', 'owner']).nullable();

export const usersDataGridNewRowSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  contactNumber: z.string().min(1),
  email: z.string().email(),
  role: userRoleSchema,
});
