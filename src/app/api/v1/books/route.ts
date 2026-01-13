import { BookController } from '@/modules/book/book.controller';

export async function POST(req: Request) {
  return BookController.createBook(req);
}

export async function GET(req: Request) {
  return BookController.getAllBooks(req);
}