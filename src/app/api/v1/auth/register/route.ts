import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/modules/user/user.model';
import { UserValidation } from '@/modules/user/user.validation';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = UserValidation.userValidationSchema.parse(body);
    
    const isExist = await User.findOne({ email: validatedData.email });
    if (isExist) throw new Error('User already exists!');

    const result = await User.create(validatedData);
    return NextResponse.json({ success: true, message: 'User registered!', data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}