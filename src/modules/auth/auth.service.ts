import { User } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

const registerUser = async (payload: TRegisterUser) => {
  // ১. ইমেইল চেক
  const isExist = await User.findOne({ email: payload.email });
  if (isExist) throw new Error('User already exists with this email!');
  
  // ২. ইউজার তৈরি (পাসওয়ার্ড মডেল লেভেলে প্রি-সেভ হুক দিয়ে হ্যাশ হবে)
  const user = await User.create(payload);
  
  // ৩. রেসপন্স থেকে পাসওয়ার্ড সরিয়ে ফেলা
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
};

const loginUser = async (payload: TLoginUser) => {
  // ১. ইউজার খুঁজে বের করা
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) throw new Error('User does not exist!');

  // ২. পাসওয়ার্ড ম্যাচ করা
  const isPasswordMatch = await bcrypt.compare(payload.password!, user.password!);
  if (!isPasswordMatch) throw new Error('Incorrect password!');

  // ৩. টোকেন তৈরি
  const jwtPayload = { id: user._id, email: user.email, role: user.role };
  const accessToken = generateToken(jwtPayload);

  return { 
    accessToken, 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo
    } 
  };
};

export const AuthService = { registerUser, loginUser };