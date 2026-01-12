import { ReviewController } from '@/modules/review/review.controller';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

// Review Approve korar jonno (Admin Only Logic)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return ReviewController.approveReview(req, { params });
}

// Review Delete korar jonno (Admin Only)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    // Ekhane sora-sori service call kore delete kora jay logic simplify korar jonno
    const { ReviewService } = await import('@/modules/review/review.service');
    const result = await ReviewService.deleteReviewFromDB(params.id);
    return NextResponse.json({ success: true, message: 'Review deleted!', data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}