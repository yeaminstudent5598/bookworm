import { UserController } from '@/modules/user/user.controller';
import { NextResponse } from 'next/server';

export async function GET() {
  return UserController.getAllUsers();
}