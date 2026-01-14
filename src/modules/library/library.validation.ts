import { z } from 'zod';

const updateLibrarySchema = z.object({
  bookId: z.string().min(1, "Book ID is required"), 
  
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']).optional(),
  
  currentPage: z.number().min(0, "Page number must be 0 or greater").optional(),
});

export const LibraryValidation = {
  updateLibrarySchema,
};