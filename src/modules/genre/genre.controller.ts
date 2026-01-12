import { NextResponse } from 'next/server';
import { GenreService } from './genre.service';
import { GenreValidation } from './genre.validation';

const createGenre = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = GenreValidation.genreValidationSchema.parse(body);
    const result = await GenreService.createGenreInDB(validatedData);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getAllGenres = async () => {
  try {
    const result = await GenreService.getAllGenresFromDB();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const GenreController = { createGenre, getAllGenres };