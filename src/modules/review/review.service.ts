import { Review } from './review.model';
import { User } from '../user/user.model'; // Populate এর জন্য মডেল ইম্পোর্ট জরুরি
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';
import mongoose from 'mongoose';

const createReviewInDB = async (payload: any) => await Review.create(payload);

const getAllReviewsFromDB = async (status: string) => {
  // মঙ্গুস যেন নিশ্চিতভাবে মডেলগুলো পায় তার জন্য একবার কল করা (Safety check)
  const models = { User, Book }; 

  return await Review.find({ status })
    .populate({
      path: 'user',
      select: 'name photo email' // ইউজারের প্রয়োজনীয় তথ্য
    })
    .populate({
      path: 'book',
      select: 'title author coverImage' // বইয়ের প্রয়োজনীয় তথ্য
    })
    .sort({ createdAt: -1 });
};

const updateReviewStatusInDB = async (id: string, status: string) => {
  // ১. রিভিউ আপডেট করুন
  const updatedReview = await Review.findByIdAndUpdate(id, { status }, { new: true });
  
  // ২. যদি অ্যাপ্রুভ হয়, তবে বইয়ের গড় রেটিং ক্যালকুলেট করুন
  if (status === 'approved' && updatedReview) {
    const bookId = updatedReview.book;

    const stats = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId as string), status: 'approved' } },
      { 
        $group: { 
          _id: '$book', 
          avgRating: { $avg: '$rating' }, 
          totalReviews: { $sum: 1 } 
        } 
      }
    ]);

    if (stats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: parseFloat(stats[0].avgRating.toFixed(1)),
        totalReviews: stats[0].totalReviews
      });
    }
  }
  return updatedReview;
};

const deleteReviewFromDB = async (id: string) => {
  return await Review.findByIdAndDelete(id);
};

export const ReviewService = { 
  createReviewInDB, 
  getAllReviewsFromDB, 
  updateReviewStatusInDB, 
  deleteReviewFromDB 
};