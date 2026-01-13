import { User } from '../user/user.model';
import { Library } from './library.model';

const updateLibraryInDB = async (userId: string, payload: any) => {
  const { bookId, currentPage, totalPages, status } = payload;
  let updateData: any = { status };

  // ১. স্ট্যাটাস অনুযায়ী ডাটা সেট করা
  if (status === 'Want to Read') {
    updateData.currentPage = 0;
    updateData.progress = 0;
  } 
  else if (status === 'Read') {
    // যদি সরাসরি 'Mark as Finished' দেয়
    updateData.currentPage = totalPages || 0;
    updateData.progress = 100;
  }

  // ২. প্রগ্রেস ক্যালকুলেশন (Currently Reading মোডে)
  if (currentPage !== undefined) {
    updateData.currentPage = Number(currentPage);
    if (totalPages) {
      updateData.progress = Math.min(Math.round((Number(currentPage) / Number(totalPages)) * 100), 100);
    }
  }

  // ৩. ডাইনামিক স্ট্রিক আপডেট করা (Requirement)
  await updateStreak(userId);

  // ৪. ডাটাবেস আপডেট
  return await Library.findOneAndUpdate(
    { user: userId, book: bookId },
    { $set: updateData },
    { new: true, upsert: true }
  ).populate('book');
};

const getMyCategorizedLibraryFromDB = async (userId: string) => {
  const libraryItems = await Library.find({ user: userId, isDeleted: false })
    .populate('book')
    .sort({ updatedAt: -1 });

  // স্ট্যাটাস অনুযায়ী আলাদা করে পাঠানো
  return {
    currentlyReading: libraryItems.filter(item => item.status === 'Currently Reading'),
    wantToRead: libraryItems.filter(item => item.status === 'Want to Read'),
    read: libraryItems.filter(item => item.status === 'Read'),
  };
};


const updateStreak = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0]; 
  const user = await User.findById(userId);
  if (!user) return;

  const lastDate = user.lastReadingDate;
  if (lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDate === yesterdayStr) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    user.currentStreak = 1;
  }

  user.lastReadingDate = today;
  await user.save();
};

export const LibraryService = { updateLibraryInDB, getMyCategorizedLibraryFromDB, updateStreak };