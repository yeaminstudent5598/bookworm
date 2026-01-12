import { ShelfController } from '@/modules/shelf/shelf.controller';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  await dbConnect();
  return ShelfController.updateShelfStatus(req);
}

export async function GET(req: Request) {
  await dbConnect();
  return ShelfController.getMyShelves(req);
}