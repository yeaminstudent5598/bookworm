import jwt, { JwtPayload } from 'jsonwebtoken';

// ✅ .env.local থেকে সিক্রেট কী নেওয়া হচ্ছে
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    console.error("🚩 JWT Verification Failed:", error.message);
    return null;
  }
};