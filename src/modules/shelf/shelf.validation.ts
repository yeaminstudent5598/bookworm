import { z } from 'zod';

const updateShelfSchema = z.object({
  user: z.string().min(1, 'User ID is required'),
  book: z.string().min(1, 'Book ID is required'),
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']),
  progress: z.number().min(0).max(100).optional(),
});

export const ShelfValidation = { updateShelfSchema };