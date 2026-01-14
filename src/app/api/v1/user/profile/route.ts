import { UserController } from "@/modules/user/user.controller";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token and get user ID
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" }, 
        { status: 401 }
      );
    }
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" }, 
        { status: 401 }
      );
    }

    // Fetch user profile by ID from token
    return UserController.getMyProfileById(decoded.id);

  } catch (err: any) {
    console.error('Profile fetch error:', err);
    return NextResponse.json(
      { success: false, message: err.message || "Authentication failed" }, 
      { status: 500 }
    );
  }
}