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

// Old method (keeping for backward compatibility if needed)
const getMyProfile = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || email === "null") {
       return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const result = await UserService.getMyProfileFromDB(email);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

// ✅ New secure method using user ID from JWT token
const getMyProfileById = async (userId: string) => {
  try {
    await dbConnect();
    const result = await UserService.getMyProfileByIDFromDB(userId);
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: "User not found or deleted" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Get profile by ID error:', err);
    return NextResponse.json(
      { success: false, message: err.message }, 
      { status: 400 }
    );
  }
};

const getUserGrowth = async () => {
  try {
    await dbConnect();

    const result = await UserService.getUserGrowthStats();

    return NextResponse.json({
      success: true,
      message: "Monthly user growth fetched successfully!",
      data: result
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch analytics" },
      { status: 400 }
    );
  }
};

export const UserController = { 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  getMyProfile,
  getMyProfileById,
  getUserGrowth,
};