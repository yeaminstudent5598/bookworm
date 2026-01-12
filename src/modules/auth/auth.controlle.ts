import { NextResponse } from 'next/server';
import { AuthService } from './auth.service';
import { AuthValidation } from './auth.validation';

const login = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = AuthValidation.loginValidationSchema.parse(body);
    const result = await AuthService.loginUser(validatedData);
    return NextResponse.json({ success: true, message: 'Login successful', data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const AuthController = { login };