import { z } from 'zod';

const updateLibrarySchema = z.object({
  bookId: z.string({ required_error: "Book ID is required" }),
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const LibraryValidation = { updateLibrarySchema };