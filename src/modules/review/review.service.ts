import { Review } from './review.model';
import { User } from '../user/user.model'; // Populate এর জন্য মডেল ইম্পোর্ট জরুরি
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';
import mongoose from 'mongoose';

const createReviewInDB = async (payload: any) => await Review.create(payload);

const getAllReviewsFromDB = async (status: string) => {
  const models = { User, Book }; 

  return await Review.find({ status })
    .populate({
      path: 'user',
      select: 'name photo email'
    })
    .populate({
      path: 'book',
      select: 'title author coverImage'
    })
    .sort({ createdAt: -1 });
};

const updateReviewStatusInDB = async (id: string, status: string) => {
  const updatedReview = await Review.findByIdAndUpdate(id, { status }, { new: true });
  
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