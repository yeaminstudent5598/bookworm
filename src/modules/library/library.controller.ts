import { NextResponse } from 'next/server';
import { LibraryService } from './library.service';
import { LibraryValidation } from './library.validation';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt'; 

/**
 * ১. লাইব্রেরি আপডেট (PATCH)
 * ইউজার যখন স্ট্যাটাস বা প্রগ্রেস পরিবর্তন করবে
 */
const updateLibraryStatus = async (req: Request) => {
  try {
    await dbConnect();
    
    // রিকোয়েস্ট বডি এবং হেডার রিড করা
    const body = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) throw new Error("Token missing from headers!");

    // টোকেন ভেরিফাই করা (decodedUser থেকে 'id' প্রপার্টি ব্যবহার হবে)
    const decodedUser = verifyToken(token);
    if (!decodedUser) {
       // কনসোলে চেক করুন টোকেন কেন ইনভ্যালিড (JWT_SECRET ঠিক আছে তো?)
       console.error("❌ Token verification failed. Check JWT_SECRET in .env.local");
       throw new Error("Invalid or Expired Token!");
    }

    // ডাটা ভ্যালিডেশন (Zod)
    const validatedData = LibraryValidation.updateLibrarySchema.parse(body);

    // ডাটাবেস আপডেট (decodedUser.id পাঠানো হচ্ছে)
    const result = await LibraryService.updateLibraryInDB(decodedUser.id, validatedData);
    
    return NextResponse.json({ success: true, message: "Library updated!", data: result });
  } catch (err: any) {
    console.error("❌ Library Update Error:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

/**
 * ২. নিজের লাইব্রেরি দেখা (GET)
 * এটি আপনার image_2b1eba.png ডিজাইন অনুযায়ী ক্যাটাগরাইজড ডাটা পাঠাবে
 */
const getMyLibrary = async (req: Request) => {
  try {
    await dbConnect();
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) throw new Error("Unauthorized! No token found.");

    const decodedUser = verifyToken(token);
    if (!decodedUser) throw new Error("Unauthorized! Invalid session.");

    // ✅ সার্ভিস থেকে ক্যাটাগরাইজড ডাটা নেওয়া হচ্ছে
    const result = await LibraryService.getMyCategorizedLibraryFromDB(decodedUser.id);
    
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const LibraryController = { updateLibraryStatus, getMyLibrary };