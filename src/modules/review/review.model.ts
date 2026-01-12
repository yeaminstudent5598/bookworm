import { Schema, model, models } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  },
  { timestamps: true }
);

export const Review = models.Review || model<IReview>('Review', reviewSchema);