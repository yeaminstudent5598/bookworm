import { z } from 'zod';

const loginValidationSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const AuthValidation = { loginValidationSchema };