import { Genre } from './genre.model';
import { IGenre } from './genre.interface';

const createGenreInDB = async (payload: IGenre) => {
  return await Genre.create(payload);
};

const getAllGenresFromDB = async () => {
  return await Genre.find({ isDeleted: false });
};

export const GenreService = { createGenreInDB, getAllGenresFromDB };