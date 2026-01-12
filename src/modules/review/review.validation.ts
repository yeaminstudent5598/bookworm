import { z } from 'zod';

const createReviewSchema = z.object({
  user: z.string(),
  book: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export const ReviewValidation = { createReviewSchema };