import { verifyToken } from '@/lib/jwt';

export const authGuard = async (req: Request) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('You are not authorized! Please login.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new Error('Invalid or expired token!');
  }

  return decoded;
};