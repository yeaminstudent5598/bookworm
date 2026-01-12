import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Book } from '@/modules/book/book.model';
import { User } from '@/modules/user/user.model';
import { Review } from '@/modules/review/review.model';

export async function GET() {
  await dbConnect();
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments();
  const pendingReviews = await Review.countDocuments({ status: 'pending' });

  return NextResponse.json({
    success: true,
    data: { totalBooks, totalUsers, pendingReviews }
  });
}