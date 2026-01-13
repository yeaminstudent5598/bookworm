import { z } from 'zod';

const registerValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be 6+ chars'),
});

const loginValidationSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const AuthValidation = { registerValidationSchema, loginValidationSchema };