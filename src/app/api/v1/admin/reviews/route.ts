import { ReviewController } from '@/modules/review/review.controller';

export async function GET(req: Request) {
  return ReviewController.getAllReviews(req);
}