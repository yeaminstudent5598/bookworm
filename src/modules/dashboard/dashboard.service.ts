import { Library } from '../library/library.model';
import { User } from '../user/user.model';
import { Review } from '../review/review.model';
import mongoose from 'mongoose';
import { getRecommendations } from '../book/recommendation.service';

const getUserDashboardStatsFromDB = async (userId: string) => {
  const user = await User.findById(userId).select('name photo currentStreak');

  const booksFinished = await Library.countDocuments({ user: userId, status: 'Read', isDeleted: false });
  
  const activeReading = await Library.findOne({ user: userId, status: 'Currently Reading', isDeleted: false })
    .populate('book')
    .sort({ updatedAt: -1 });

  const pageStats = await Library.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$currentPage" } } }
  ]);

  const genreBreakdown = await Library.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookInfo' } },
    { $unwind: '$bookInfo' },
    { $group: { _id: '$bookInfo.genre', count: { $sum: 1 } } },
    { $lookup: { from: 'genres', localField: '_id', foreignField: '_id', as: 'genreInfo' } },
    { $unwind: '$genreInfo' },
    { $project: { name: '$genreInfo.name', value: '$count' } }
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const monthlyRawData = await Library.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isDeleted: false, updatedAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $month: "$updatedAt" }, pages: { $sum: "$currentPage" } } },
    { $sort: { "_id": 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyStats = monthlyRawData.map(item => ({
    name: monthNames[item._id - 1],
    pages: item.pages
  }));

  const recommendations = await getRecommendations(userId);

  const recentReviews = await Review.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name photo')
    .populate('book', 'title');

  return {
    user,
    stats: {
      streak: user?.currentStreak || 0,
      pagesRead: pageStats[0]?.total || 0, 
      booksFinished
    },
    activeBook: activeReading ? {
      _id: (activeReading.book as any)._id,
      title: (activeReading.book as any).title,
      coverImage: (activeReading.book as any).coverImage,
      progress: Math.round(((activeReading.currentPage || 0) / (activeReading.book as any).pages) * 100)
    } : null,
    charts: {
      genres: genreBreakdown,
      monthly: formattedMonthlyStats
    },
    challenge: { goal: 50, finished: booksFinished },
    recommendations,
    activities: recentReviews.map(rev => ({
      userName: (rev.user as any)?.name || "Reader",
      userPhoto: (rev.user as any)?.photo || "/placeholder.png",
      action: "rated",
      target: (rev.book as any)?.title || "a book",
      rating: rev.rating,
      comment: rev.comment
    }))
  };
};

export const DashboardService = { getUserDashboardStatsFromDB };