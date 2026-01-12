import { Schema, model, models } from 'mongoose';
import { IGenre } from './genre.interface';

const genreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Genre = models.Genre || model<IGenre>('Genre', genreSchema);