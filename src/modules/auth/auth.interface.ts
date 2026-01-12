import { z } from 'zod';
import { AuthValidation } from './auth.validation';

export type TLoginUser = z.infer<typeof AuthValidation.loginValidationSchema>;