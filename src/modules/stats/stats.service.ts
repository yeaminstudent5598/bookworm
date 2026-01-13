import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { Review } from '../review/review.model';

const getAdminStatsFromDB = async () => {
  // ১. বেসিক কাউন্টস (একসাথে ৩টি কুয়েরি চালানো হচ্ছে পারফরম্যান্সের জন্য)
  const [totalBooks, totalUsers, pendingReviews] = await Promise.all([
    Book.countDocuments({ isDeleted: false }),
    User.countDocuments({ role: 'reader', isDeleted: false }),
    Review.countDocuments({ status: 'pending' })
  ]);

  // ২. জেনার স্ট্যাটস (বইয়ের সংখ্যা অনুযায়ী পারসেন্টেজ)
  const genreAggregation = await Book.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $lookup: { from: 'genres', localField: '_id', foreignField: '_id', as: 'genreInfo' } },
    { $unwind: '$genreInfo' }
  ]);

  const genreStats = genreAggregation.map(g => ({
    name: g.genreInfo.name,
    percentage: totalBooks > 0 ? Math.round((g.count / totalBooks) * 100) : 0
  }));

  // ৩. ইউজার গ্রোথ (মাসিক ডাটা - সিমুলেশন)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const userGrowth = months.map((m, i) => ({
    month: m,
    count: Math.floor(Math.random() * 200) + 100,
    percentage: (i + 1) * 15
  }));

  // ৪. রিসেন্ট অ্যাক্টিভিটি (সর্বশেষ ৫টি পাবলিশড বই)
  const recentBooks = await Book.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentActivities = recentBooks.map(b => ({
    id: b._id,
    title: `Added "${b.title}"`,
    status: 'Published',
    date: b.createdAt
  }));

  return { totalBooks, totalUsers, pendingReviews, genreStats, userGrowth, recentActivities };
};

export const StatsService = { getAdminStatsFromDB };