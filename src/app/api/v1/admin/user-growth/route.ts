import { UserController } from "@/modules/user/user.controller";


export async function GET() {
  return UserController.getUserGrowth();
}