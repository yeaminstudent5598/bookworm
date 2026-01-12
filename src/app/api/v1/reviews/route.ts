import { ReviewController } from '@/modules/review/review.controller';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  await dbConnect();
  return ReviewController.createReview(req);
}

export async function GET(req: Request) {
  await dbConnect();
  return ReviewController.getApprovedReviewsByBook(req); 
}