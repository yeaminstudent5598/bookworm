import { z } from 'zod';

const genreValidationSchema = z.object({
  name: z.string().min(1, 'Genre name is required'),
});

export const GenreValidation = { genreValidationSchema };