import { Review } from './review.model';
import { User } from '../user/user.model'; // Populate এর জন্য মডেল ইম্পোর্ট জরুরি
import { Book } from '../book/book.model';

const createReviewInDB = async (payload: any) => await Review.create(payload);

const getAllReviewsFromDB = async (status: string) => {
  return await Review.find({ status })
    .populate({ path: 'user', select: 'name photo' })
    .populate({ path: 'book', select: 'title author coverImage' })
    .sort({ createdAt: -1 });
};

const updateReviewStatusInDB = async (id: string, status: string) => {
  return await Review.findByIdAndUpdate(id, { status }, { new: true });
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