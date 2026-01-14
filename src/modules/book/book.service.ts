import mongoose from 'mongoose';
import { Book } from './book.model';
import { Genre } from '../genre/genre.model';
import { Review } from '../review/review.model';

const createBookInDB = async (payload: any) => await Book.create(payload);

const getAllBooksFromDB = async (query: any) => {
  const { searchTerm, genre, sort, rating, page = 1, limit = 12 } = query;
  
  let filter: any = { isDeleted: false };

  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { author: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (genre) {
    const genreArray = genre.split(',').filter((id: string) => mongoose.Types.ObjectId.isValid(id));
    if (genreArray.length > 0) {
      filter.genre = { $in: genreArray };
    }
  }
  if (rating && Number(rating) > 1) {
    filter.averageRating = Number(rating); 
  }

  let sortCondition: any = { createdAt: -1 }; // Default: Newest
  if (sort === 'Top Rated') sortCondition = { averageRating: -1 };
  else if (sort === 'Popular') sortCondition = { totalReviews: -1 };
  else if (sort === 'Oldest') sortCondition = { createdAt: 1 };

  const skip = (Number(page) - 1) * Number(limit);

  const result = await Book.find(filter)
    .populate({ path: 'genre', model: Genre })
    .sort(sortCondition)
    .skip(skip)
    .limit(Number(limit));

  const total = await Book.countDocuments(filter);

  return {
    data: result,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

const getSingleBookFromDB = async (id: string) => {
  const book = await Book.findById(id).populate('genre');
  if (!book) return null;


  const reviews = await Review.find({ 
    book: id, 
    status: 'approved' 
  }).populate('user', 'name photo');

  return {
    ...book.toObject(),
    reviews 
  };
};

const updateBookInDB = async (id: string, payload: any) => 
  await Book.findByIdAndUpdate(id, payload, { new: true });

const deleteBookFromDB = async (id: string) => 
  await Book.findByIdAndUpdate(id, { isDeleted: true }, { new: true });


const updateBookRatingAndReviews = async (bookId: string) => {
  const approvedReviews = await Review.find({ book: bookId, status: 'approved' });

  const totalReviews = approvedReviews.length;
  
  if (totalReviews === 0) {
    return await Book.findByIdAndUpdate(bookId, { averageRating: 0, totalReviews: 0 });
  }

  const sumRatings = approvedReviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));

  return await Book.findByIdAndUpdate(bookId, {
    averageRating,
    totalReviews
  }, { new: true });
};

export const BookService = { 
  createBookInDB, 
  getAllBooksFromDB, 
  getSingleBookFromDB, 
  updateBookInDB, 
  deleteBookFromDB,
  updateBookRatingAndReviews,
};