import { Shelf } from '../shelf/shelf.model';
import { Book } from './book.model';

const getRecommendations = async (userId: string) => {
  // 1. User-er 'Read' shelf theke boigulo khuje ber kora
  const readBooks = await Shelf.find({ user: userId, status: 'Read' }).populate('book');
  
  // 2. Favorite genres ber kora
  const genres = readBooks.map((item: any) => item.book.genre);
  
  let recommendedBooks;

  if (genres.length >= 3) {
    // History thakle: Oi genre-er boi suggest kora jeta user ekhono poreni
    recommendedBooks = await Book.find({
      genre: { $in: genres },
      _id: { $nin: readBooks.map((item: any) => item.book._id) }
    }).limit(12).populate('genre');
  } else {
    // Fallback: High rated ba popular books
    recommendedBooks = await Book.find().sort({ averageRating: -1 }).limit(12).populate('genre');
  }

  return recommendedBooks;
};

export const RecommendationService = { getRecommendations };