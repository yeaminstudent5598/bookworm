import { UserService } from '@/modules/user/user.service';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { role } = await req.json();
    const result = await UserService.updateUserRoleInDB(params.id, role);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}