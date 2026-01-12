import dbConnect from '@/lib/dbConnect';
import { AuthController } from '@/modules/auth/auth.controlle';

export async function POST(req: Request) {
  await dbConnect();
  return AuthController.login(req);
}