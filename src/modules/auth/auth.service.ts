import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) throw new Error('User does not exist!');

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password!);
  if (!isPasswordMatch) throw new Error('Password incorrect!');

  const jwtPayload = { email: user.email, role: user.role };
  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

  return { accessToken, user };
};

export const AuthService = { loginUser };