import { NextResponse } from 'next/server';
import { UserService } from './user.service';
import dbConnect from '@/lib/dbConnect';

const getAllUsers = async () => {
  try {
    await dbConnect();
    const result = await UserService.getAllUsersFromDB();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const updateUserRole = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const { role } = await req.json(); 
    const result = await UserService.updateUserRoleInDB(id, role);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteUser = async (id: string) => {
  try {
    await dbConnect();
    await UserService.deleteUserFromDB(id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getMyProfile = async (req: Request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); 
    const result = await UserService.getMyProfileFromDB(email!);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const UserController = { 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  getMyProfile 
};