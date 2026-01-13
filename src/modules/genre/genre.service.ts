import { Genre } from './genre.model';
import { IGenre } from './genre.interface';
import { Book } from '../book/book.model';

const createGenreInDB = async (payload: IGenre) => {
  return await Genre.create(payload);
};

const getAllGenresFromDB = async () => {
  const genres = await Genre.find({ isDeleted: false }).lean();

  const genresWithCount = await Promise.all(
    genres.map(async (genre) => {
      const count = await Book.countDocuments({ 
        genre: genre._id, 
        isDeleted: false 
      });
      return {
        ...genre,
        bookCount: count 
      };
    })
  );

  return genresWithCount;
};

const updateGenreInDB = async (id: string, payload: Partial<IGenre>) => {
  return await Genre.findByIdAndUpdate(id, payload, { new: true });
};

const deleteGenreFromDB = async (id: string) => {
  return await Genre.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const GenreService = { 
  createGenreInDB, 
  getAllGenresFromDB,
  updateGenreInDB,
  deleteGenreFromDB
};