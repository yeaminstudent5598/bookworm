import { Shelf } from '../shelf/shelf.model';
import { Book } from './book.model';

const getRecommendations = async (userId: string) => {
  // ১. ইউজারের পড়া বইগুলোর জেনার খুঁজে বের করা
  const readBooks = await Shelf.find({ user: userId, status: 'Read' }).populate('book');
  
  const readBookIds = readBooks.map(item => (item.book as any)._id.toString());
  const readGenreIds = readBooks.map(item => (item.book as any).genre.toString());
  const uniqueGenres = Array.from(new Set(readGenreIds));

  // ২. যদি ইউজার অন্তত ৩টি বই পড়ে থাকে
  if (uniqueGenres.length > 0 && readBooks.length >= 3) {
    const recommended = await Book.find({
      genre: { $in: uniqueGenres },
      _id: { $nin: readBookIds },
      isDeleted: false
    }).limit(12).populate('genre');

    return recommended.map(book => ({
      ...book.toObject(),
      reason: `Matches your interest in ${(book.genre as any).name}`
    }));
  }

  // ৩. Fallback: জনপ্রিয় এবং টপ রেটেড বই (যদি ইউজার < ৩ বই পড়ে থাকে)
  const popular = await Book.find({ isDeleted: false })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(18)
    .populate('genre');
    
  return popular.map(book => ({
    ...book.toObject(),
    reason: "Popular in BookWorm community"
  }));
};

export const RecommendationService = { getRecommendations };