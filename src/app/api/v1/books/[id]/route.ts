import { BookController } from '@/modules/book/book.controller';

export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BookController.getSingleBook(id);
}

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BookController.updateBook(req, id);
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BookController.deleteBook(id);
}