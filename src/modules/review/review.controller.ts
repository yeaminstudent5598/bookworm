import { NextResponse } from 'next/server';
import { ReviewService } from './review.service';
import { ReviewValidation } from './review.validation';

const createReview = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = ReviewValidation.createReviewSchema.parse(body);
    const result = await ReviewService.createReviewInDB(validatedData);
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted for moderation!', 
      data: result 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const approveReview = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const result = await ReviewService.approveReviewInDB(params.id);
    return NextResponse.json({ success: true, message: 'Review approved!', data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

// --- EI FUNCTION-TI MISSING CHILO ---
const getApprovedReviewsByBook = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      throw new Error('Book ID is required to fetch reviews');
    }

    const result = await ReviewService.getApprovedReviewsByBook(bookId);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const ReviewController = { 
  createReview, 
  approveReview, 
  getApprovedReviewsByBook
};