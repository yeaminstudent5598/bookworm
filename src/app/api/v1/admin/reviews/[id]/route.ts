import { ReviewController } from '@/modules/review/review.controller';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ReviewController.updateReviewStatus(req, id);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ReviewController.deleteReview(id);
}