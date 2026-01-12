import { BookController } from '@/modules/book/book.controller';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  await dbConnect();
  return BookController.createBook(req);
}

export async function GET(req: Request) {
  await dbConnect();
  return BookController.getAllBooks(req);
}