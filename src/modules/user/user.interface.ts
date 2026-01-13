export type TUserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  photo: string; // Cloudinary URL
  role: TUserRole;
  isDeleted: boolean;
  preferences?: string[]; 
}