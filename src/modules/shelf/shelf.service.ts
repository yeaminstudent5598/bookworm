import { Shelf } from './shelf.model';

const updateShelfStatusInDB = async (payload: any) => {
  const { user, book, status, progress } = payload;
  return await Shelf.findOneAndUpdate(
    { user, book },
    { status, progress },
    { upsert: true, new: true }
  );
};

const getMyShelvesFromDB = async (userId: string) => {
  return await Shelf.find({ user: userId }).populate('book');
};

export const ShelfService = { updateShelfStatusInDB, getMyShelvesFromDB };