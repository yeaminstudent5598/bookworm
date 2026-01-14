import { NextResponse } from 'next/server';
import { AuthService } from './auth.service';
import { AuthValidation } from './auth.validation';
import { uploadToCloudinary } from '@/lib/cloudinary';
import dbConnect from '@/lib/dbConnect';

const register = async (req: Request) => {
  try {
    await dbConnect(); 

    const formData = await req.formData();
    const file = formData.get('photo') as File;
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const validatedData = AuthValidation.registerValidationSchema.parse(userData);

    if (!file) throw new Error("Profile photo is required");

    const uploadRes = await uploadToCloudinary(file, 'user_profiles');

    const result = await AuthService.registerUser({
      ...validatedData,
      photo: uploadRes.url
    });

    return NextResponse.json({ success: true, message: 'User registered', data: result });
  } catch (err: any) {
    console.log("❌ Registration Error Details:", err); 

    return NextResponse.json({ 
        success: false, 
        message: err.message || "Registration failed",
        error: err
    }, { status: 400 });
  }
};

const login = async (req: Request) => {
  try {
    await dbConnect();

    const body = await req.json();

    const validatedData = AuthValidation.loginValidationSchema.parse(body);

    const result = await AuthService.loginUser(validatedData);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Welcome to BookWorm.',
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    });

    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, 
      path: '/',
    });

    return response;

  } catch (err: any) {
    console.error("❌ Login Error:", err.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || 'Login failed. Please check your credentials.' 
      }, 
      { status: 400 }
    );
  }
};


const forgotPassword = async (req: Request) => {
  try {
    await dbConnect();
    const { email } = await req.json();
    const result = await AuthService.forgotPassword(email);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const resetPassword = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const result = await AuthService.resetPassword(body);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};


const changePassword = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, ...passwordData } = body; 

    if (!userId) throw new Error("Unauthorized access!");

    const result = await AuthService.changePassword(userId, passwordData);
    
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to change password" }, 
      { status: 400 }
    );
  }
};

export const AuthController = { register, login, forgotPassword, resetPassword, changePassword };