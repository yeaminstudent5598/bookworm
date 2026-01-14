import { Types } from 'mongoose';

export interface IShelf {
  user: Types.ObjectId | string;
  book: Types.ObjectId | string;
  status: 'Want to Read' | 'Currently Reading' | 'Read';
  progress: number; 
}