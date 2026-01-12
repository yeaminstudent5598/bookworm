import { NextResponse } from 'next/server';
import { UserService } from './user.service';

const getMyProfile = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Temporary logic until JWT middleware
    const result = await UserService.getMyProfileFromDB(email!);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const UserController = { getMyProfile };