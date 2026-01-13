import { GenreController } from '@/modules/genre/genre.controller';

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return GenreController.updateGenre(req, id);
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return GenreController.deleteGenre(id);
}