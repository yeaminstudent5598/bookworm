import { Library } from '../library/library.model'; // আপনার লাইব্রেরি মডেল অনুযায়ী
import { Book } from './book.model';

const getRecommendations = async (userId: string) => {
  const userLibrary = await Library.find({ user: userId, isDeleted: false }).populate('book');
  
  const readBookIds = userLibrary.map(item => (item.book as any)._id);
  
  const preferredGenres = userLibrary.map(item => (item.book as any).genre.toString());
  const uniqueGenres = Array.from(new Set(preferredGenres));

  if (uniqueGenres.length > 0) {
    const recommended = await Book.find({
      genre: { $in: uniqueGenres }, 
      _id: { $nin: readBookIds },    
    })
    .sort({ averageRating: -1 }) 
    .limit(12)
    .populate('genre');

    if (recommended.length > 0) {
      return recommended.map(book => ({
        ...book.toObject(),
        reason: `Based on your interest in ${(book.genre as any).name}`
      }));
    }
  }

  const popular = await Book.find({ isDeleted: false })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(18)
    .populate('genre');
    
  return popular.map(book => ({
    ...book.toObject(),
    reason: "Trending in BookWorm"
  }));
};

export const RecommendationService = { getRecommendations };