import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/modules/user/user.model";
// মডেল রেজিস্ট্রেশন এরর এড়াতে Genre মডেলটি সরাসরি ইমপোর্ট করুন
import "@/modules/genre/genre.model"; 

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
    }

    // Genre মডেল ইমপোর্ট করায় এখন populate('preferences') আর এরর দিবে না
    const userData = await User.findById(decoded.id).populate('preferences').select("-password");
    
    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: userData
    });

  } catch (err: any) {
    console.error("🚩 Profile API Error:", err.message);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}