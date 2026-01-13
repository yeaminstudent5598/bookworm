import { z } from 'zod';

const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre ID is required'),
  description: z.string().min(10, 'Description must be at least 10 chars'),
  pages: z.coerce.number().min(1, 'Pages must be at least 1'),
  pubYear: z.coerce.number().min(1000, 'Invalid publication year'),
});

const updateBookSchema = createBookSchema.partial();

export const BookValidation = { createBookSchema, updateBookSchema };