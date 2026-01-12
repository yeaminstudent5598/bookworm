import { Review } from './review.model';

const createReviewInDB = async (payload: any) => await Review.create(payload);

const approveReviewInDB = async (id: string) => {
  return await Review.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
};

const getApprovedReviewsByBook = async (bookId: string) => {
  return await Review.find({ book: bookId, status: 'approved' }).populate('user');
};
const deleteReviewFromDB = async (id: string) => {
  return await Review.findByIdAndDelete(id);
};
export const ReviewService = { createReviewInDB, approveReviewInDB, getApprovedReviewsByBook, deleteReviewFromDB };