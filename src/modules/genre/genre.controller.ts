import { NextResponse } from 'next/server';
import { GenreService } from './genre.service';
import { GenreValidation } from './genre.validation';
import dbConnect from '@/lib/dbConnect';

const createGenre = async (req: Request) => {
  try {
    await dbConnect();
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
    await dbConnect();
    const result = await GenreService.getAllGenresFromDB();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const updateGenre = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const body = await req.json();
    const result = await GenreService.updateGenreInDB(id, body);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteGenre = async (id: string) => {
  try {
    await dbConnect();
    await GenreService.deleteGenreFromDB(id);
    return NextResponse.json({ success: true, message: "Genre deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const GenreController = { createGenre, getAllGenres, updateGenre, deleteGenre };