import { Library } from '../library/library.model';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { Review } from '../review/review.model';
import { RecommendationService } from '../book/recommendation.service';
import mongoose from 'mongoose';

const getUserDashboardStatsFromDB = async (userId: string) => {
  // ১. ইউজারের বেসিক ইনফো এবং স্ট্রিক আনা
  const user = await User.findById(userId).select('name photo currentStreak');

  // ২. লাইব্রেরি সামারি: মোট পড়া বইয়ের সংখ্যা
  const booksFinished = await Library.countDocuments({ user: userId, status: 'Read' });
  
  // বর্তমানে পড়ছে এমন লেটেস্ট বই (Jump Back In সেকশনের জন্য)
  const activeReading = await Library.findOne({ user: userId, status: 'Currently Reading' })
    .populate('book')
    .sort({ updatedAt: -1 });

  // ৩. ডাইনামিক টোটাল পেইজ ক্যালকুলেশন (ObjectId Casting Fix)
  const pageStats = await Library.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$currentPage" } } }
  ]);

  // ৪. গ্রাফ ১: জেনার ব্রেকডাউন (Donut Chart)
  const genreBreakdown = await Library.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookInfo' } },
    { $unwind: '$bookInfo' },
    { $group: { _id: '$bookInfo.genre', count: { $sum: 1 } } },
    { $lookup: { from: 'genres', localField: '_id', foreignField: '_id', as: 'genreInfo' } },
    { $unwind: '$genreInfo' },
    { $project: { name: '$genreInfo.name', value: '$count' } }
  ]);

  // ৫. গ্রাফ ২: ডাইনামিক মাসিক প্রগ্রেস (Pages per Month - গত ৬ মাস)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const monthlyRawData = await Library.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        updatedAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { $month: "$updatedAt" },
        pages: { $sum: "$currentPage" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // মাসের নাম ম্যাপ করার হেল্পার
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlyStats = monthlyRawData.map(item => ({
    name: monthNames[item._id - 1],
    pages: item.pages
  }));

  // ৬. পার্সোনালাইজড রিকমেন্ডেশন
  const recommendations = await RecommendationService.getRecommendations(userId);

  // ৭. ডাইনামিক সোশ্যাল ফিড (লেটেস্ট রিভিউসমূহ)
  const recentReviews = await Review.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(4)
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
      action: "finished reading",
      target: (rev.book as any)?.title || "a book",
      rating: rev.rating,
      comment: rev.comment
    }))
  };
};

export const DashboardService = { getUserDashboardStatsFromDB };