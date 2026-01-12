import { z } from 'zod';

const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre ID is required'),
  description: z.string().optional(),
  coverImage: z.string().url('Invalid image URL').optional(),
});

export const BookValidation = { createBookSchema };