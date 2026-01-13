import { Types } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  genre: Types.ObjectId; 
  description: string;
  coverImage: string;
  pages: number;
  pubYear: number;
  averageRating: number;
  totalReviews: number;
  isDeleted: boolean;
}