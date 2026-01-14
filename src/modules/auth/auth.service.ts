import { User } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { redis } from '@/lib/redis';
import { sendEmail } from '@/lib/sendEmail';

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



const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found!');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, 'EX', 300);

  await sendEmail(email, "Reset Your BookWorm Password", { otp });
  return { message: "OTP sent to your email" };
};

const resetPassword = async (payload: any) => {
  const { email, otp, newPassword } = payload;
  const cachedOtp = await redis.get(`otp:${email}`);

  if (!cachedOtp || cachedOtp !== otp) throw new Error('Invalid or expired OTP!');

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found!');

  user.password = newPassword;
  await user.save();
  await redis.del(`otp:${email}`);

  return { message: "Password reset successful" };
};

const changePassword = async (userId: string, payload: any) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found!');

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password!);
  if (!isPasswordMatch) throw new Error('Old password does not match!');


  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully!" };
};

export const AuthService = { registerUser,forgotPassword, resetPassword, loginUser, changePassword };