export interface IBook {
  title: string;
  author: string;
  genre?: string; // Genre ID
  description: string;
  coverImage: string;
  averageRating: number;
  totalReviews: number;
  isDeleted: boolean;
}