import { Schema, model, models } from 'mongoose';
import { IBook } from './book.interface';

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    pages: { type: Number, required: true },
    pubYear: { type: Number, required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Book = models.Book || model<IBook>('Book', bookSchema);