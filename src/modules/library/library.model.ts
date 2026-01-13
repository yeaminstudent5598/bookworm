import { Schema, model, models } from 'mongoose';
import { ILibrary } from './library.interface';

const librarySchema = new Schema<ILibrary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { 
      type: String, 
      enum: ['Want to Read', 'Currently Reading', 'Read'], 
      default: 'Want to Read' 
    },
    currentPage: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

librarySchema.index({ user: 1, book: 1 }, { unique: true });

export const Library = models.Library || model<ILibrary>('Library', librarySchema);