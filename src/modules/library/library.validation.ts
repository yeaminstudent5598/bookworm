import { z } from 'zod';

const updateLibrarySchema = z.object({
  bookId: z.string({ required_error: "Book ID is required" }),
  status: z.enum(['Want to Read', 'Currently Reading', 'Read']).optional(),
  // ✅ এই দুটি ফিল্ড যোগ না করলে Zod ডাটা আটকে দেবে
  currentPage: z.number().min(0).optional(),
  totalPages: z.number().min(1).optional(),
});

export const LibraryValidation = { updateLibrarySchema };