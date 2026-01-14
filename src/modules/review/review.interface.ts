import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId | string;
  book: Types.ObjectId | string;
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'approved'; 
}