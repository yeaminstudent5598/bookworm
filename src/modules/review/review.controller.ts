import { NextResponse } from 'next/server';
import { ReviewService } from './review.service';
import { ReviewValidation } from './review.validation';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt';

const createReview = async (req: Request) => {
  try {
    await dbConnect(); //
    const body = await req.json();
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) throw new Error("Unauthorized! Please login.");
    
    const decodedUser = verifyToken(token);
    if (!decodedUser) throw new Error("Invalid session. Please login again.");

    const reviewData = {
      ...body,
      user: decodedUser.id, 
      book: body.bookId   
    };

    const validatedData = ReviewValidation.createReviewSchema.parse(reviewData);
    const result = await ReviewService.createReviewInDB(validatedData);
    
    return NextResponse.json({ success: true, message: 'Review submitted for moderation!', data: result });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      message: err.name === 'ZodError' ? "Validation failed: Comment must be 10+ characters" : err.message 
    }, { status: 400 });
  }
};

const getAllReviews = async (req: Request) => {
  try {
    await dbConnect(); //
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const decoded = verifyToken(token || "");

    console.log("🛠️ Admin Access Request by Role:", decoded?.role);

    if (!decoded || decoded.role !== 'admin') {
      throw new Error("Access Denied! Admin permissions required.");
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    
    const result = await ReviewService.getAllReviewsFromDB(status);
    
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 401 });
  }
};

const approveReview = async (req: Request, id: string) => {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token || "");
    if (!decoded || decoded.role !== 'admin') throw new Error("Access Denied!");

    const body = await req.json();
    const result = await ReviewService.updateReviewStatusInDB(id, body.status || 'approved');
    
    return NextResponse.json({ success: true, message: `Review ${body.status || 'approved'}!`, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteReview = async (id: string) => {
  try {
    await dbConnect(); //
    await ReviewService.deleteReviewFromDB(id);
    
    return NextResponse.json({ success: true, message: 'Review deleted permanently' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const ReviewController = { 
  createReview, 
  getAllReviews, 
  approveReview, 
  deleteReview 
};