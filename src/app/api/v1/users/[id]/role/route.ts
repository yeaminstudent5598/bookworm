import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/modules/user/user.model';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { role } = await req.json(); // 'admin' or 'user'
  const result = await User.findByIdAndUpdate(params.id, { role }, { new: true });
  return NextResponse.json({ success: true, message: 'User role updated', data: result });
}