import { Library } from "../library/library.model";
import { Book } from "./book.model";

export const getRecommendations = async (userId: string) => {
  const readLibrary = await Library.find({ 
    user: userId, 
    status: 'Read', 
    isDeleted: false 
  }).populate('book');
  
  const readBooksCount = readLibrary.length;
  const readBookIds = readLibrary.map(item => (item.book as any)._id);

  if (readBooksCount >= 3) {
    const preferredGenres = readLibrary.map(item => (item.book as any).genre.toString());
    const uniqueGenres = Array.from(new Set(preferredGenres));

    const recommended = await Book.find({
      genre: { $in: uniqueGenres }, 
      _id: { $nin: readBookIds }, 
      isDeleted: false
    })
    .sort({ averageRating: -1 }) 
    .limit(12)
    .populate('genre');

    if (recommended.length > 0) {
      return recommended.map(book => ({
        ...book.toObject(),
        reason: `Matches your preference for ${(book.genre as any).name}` 
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