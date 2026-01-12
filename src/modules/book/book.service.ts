import { Book } from './book.model';

const createBookInDB = async (payload: any) => await Book.create(payload);

const getAllBooksFromDB = async (query: any) => {
  const { searchTerm, genre, sortBy } = query;
  let filter: any = { isDeleted: false };

  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { author: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (genre) filter.genre = genre;

  const sortCondition = sortBy === 'rating' ? { averageRating: -1 } : { createdAt: -1 };

  return await Book.find(filter).populate('genre').sort(sortCondition as any);
};

export const BookService = { createBookInDB, getAllBooksFromDB };