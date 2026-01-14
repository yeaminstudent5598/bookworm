import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your_super_secret_key_123';

export const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    if (typeof window !== "undefined") {
      return jwtDecode(token) as JwtPayload;
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    console.error("🚩 JWT Processing Failed:", error.message);
    return null;
  }
};