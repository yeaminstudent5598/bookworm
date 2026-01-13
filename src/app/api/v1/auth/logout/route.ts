import { AuthController } from "@/modules/auth/auth.controlle";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  return AuthController.logout(req);
}

