import { z } from 'zod';

const userValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional(),
  preferences: z.array(z.string()).optional(),
});

export const UserValidation = { userValidationSchema };