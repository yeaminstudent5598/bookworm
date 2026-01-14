export type TUserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  photo: string; 
  role: TUserRole;
  isDeleted: boolean;
  currentStreak: number;
  lastReadingDate: string;
  preferences?: string[]; 
}