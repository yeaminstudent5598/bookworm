// ✅ CLEAN - src/app/api/v1/auth/login/route.ts

import { AuthController } from "@/modules/auth/auth.controlle";
import { NextRequest, NextResponse } from "next/server";

// POST request handle
export async function POST(req: NextRequest) {
  return AuthController.login(req);
}