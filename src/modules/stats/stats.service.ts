import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { Review } from '../review/review.model';

const getAdminStatsFromDB = async () => {
  const [totalBooks, totalUsers, pendingReviews] = await Promise.all([
    Book.countDocuments({ isDeleted: false }),
    User.countDocuments({ role: 'reader', isDeleted: false }),
    Review.countDocuments({ status: 'pending' })
  ]);

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

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const userGrowth = months.map((m, i) => ({
    month: m,
    count: Math.floor(Math.random() * 200) + 100,
    percentage: (i + 1) * 15
  }));

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