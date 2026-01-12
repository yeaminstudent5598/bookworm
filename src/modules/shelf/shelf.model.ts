import { Schema, model, models } from 'mongoose';
import { IShelf } from './shelf.interface';

const shelfSchema = new Schema<IShelf>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: ['Want to Read', 'Currently Reading', 'Read'], default: 'Want to Read' },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Shelf = models.Shelf || model<IShelf>('Shelf', shelfSchema);