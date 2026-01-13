import mongoose from 'mongoose';
import { Book } from './book.model';
import { Genre } from '../genre/genre.model';

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

  // যদি জেনার ফিল্টার থাকে এবং সেটি ভ্যালিড আইডি হয়
  if (genre && mongoose.Types.ObjectId.isValid(genre)) {
    filter.genre = genre;
  }

  const sortCondition = sortBy === 'rating' ? { averageRating: -1 } : { createdAt: -1 };

  // ✅ populate করার সময় এখন আর এরর দিবে না কারণ Genre মডেল রেজিস্টার হয়েছে
  return await Book.find(filter)
    .populate({
      path: 'genre',
      model: Genre // সরাসরি মডেলটি চিনিয়ে দেওয়া সেফ
    })
    .sort(sortCondition as any);
};

const getSingleBookFromDB = async (id: string) => 
  await Book.findById(id).populate('genre');

const updateBookInDB = async (id: string, payload: any) => 
  await Book.findByIdAndUpdate(id, payload, { new: true });

const deleteBookFromDB = async (id: string) => 
  await Book.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

export const BookService = { 
  createBookInDB, 
  getAllBooksFromDB, 
  getSingleBookFromDB, 
  updateBookInDB, 
  deleteBookFromDB 
};