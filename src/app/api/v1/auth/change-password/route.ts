import { AuthController } from "@/modules/auth/auth.controlle";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return AuthController.changePassword(req);
}