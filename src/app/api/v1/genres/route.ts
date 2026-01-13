import { GenreController } from '@/modules/genre/genre.controller';

export async function GET() {
  return GenreController.getAllGenres();
}

export async function POST(req: Request) {
  return GenreController.createGenre(req);
}