import { NextResponse } from 'next/server';
import { ReviewService } from './review.service';
import { ReviewValidation } from './review.validation';
import dbConnect from '@/lib/dbConnect';

const createReview = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = ReviewValidation.createReviewSchema.parse(body);
    const result = await ReviewService.createReviewInDB(validatedData);
    return NextResponse.json({ success: true, message: 'Review submitted for moderation!', data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getAllReviews = async (req: Request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const result = await ReviewService.getAllReviewsFromDB(status);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const updateReviewStatus = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const body = await req.json(); // { status: 'approved' }
    const result = await ReviewService.updateReviewStatusInDB(id, body.status);
    return NextResponse.json({ success: true, message: `Review ${body.status}!`, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteReview = async (id: string) => {
  try {
    await dbConnect();
    await ReviewService.deleteReviewFromDB(id);
    return NextResponse.json({ success: true, message: 'Review deleted permanently' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const ReviewController = { 
  createReview, 
  getAllReviews, 
  updateReviewStatus, 
  deleteReview 
};