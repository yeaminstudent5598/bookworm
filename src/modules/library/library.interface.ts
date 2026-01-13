import { Types } from 'mongoose';

export interface ILibrary {
  user: Types.ObjectId;
  book: Types.ObjectId;
  status: 'Want to Read' | 'Currently Reading' | 'Read';
  currentPage: number; 
  totalPages: number;  
  progress: number;
  isDeleted: boolean;
}