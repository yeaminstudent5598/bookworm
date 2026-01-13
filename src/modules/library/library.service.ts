import { Library } from './library.model';

const updateLibraryInDB = async (userId: string, payload: any) => {
  const { bookId, currentPage, totalPages, status } = payload;
  
  let updateData: any = { status };

  // ১. যদি শুধু স্ট্যাটাস পরিবর্তন হয় (যেমন: Browse পেজ থেকে 'Want to Read' ক্লিক করা)
  if (status === 'Want to Read') {
    updateData.currentPage = 0;
    updateData.progress = 0;
  } 
  
  // ২. যদি বই শেষ হয়ে যায়
  else if (status === 'Read') {
    updateData.currentPage = totalPages || 0;
    updateData.progress = 100;
  }

  // ৩. যদি প্রগ্রেস আপডেট করা হয় (Currently Reading মোডে)
  if (currentPage !== undefined) {
    updateData.currentPage = Number(currentPage);
    if (totalPages) {
      updateData.progress = Math.round((Number(currentPage) / Number(totalPages)) * 100);
    }
  }

  // ডাটাবেসে আপডেট বা নতুন ইনসার্ট (Upsert)
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

export const LibraryService = { updateLibraryInDB, getMyCategorizedLibraryFromDB };