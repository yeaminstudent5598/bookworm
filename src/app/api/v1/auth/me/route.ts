import { AuthController } from "@/modules/auth/auth.controlle";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return AuthController.getCurrentUser(req);
}