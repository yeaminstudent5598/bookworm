import { Library } from '../library/library.model';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';

const getUserDashboardStatsFromDB = async (userId: string) => {
  // ১. ইউজারের বেসিক ইনফো
  const user = await User.findById(userId).select('name photo');

  // ২. লাইব্রেরি স্ট্যাটস (বইয়ের সংখ্যা ও প্রগ্রেস)
  const booksFinished = await Library.countDocuments({ user: userId, status: 'Read' });
  const currentlyReading = await Library.find({ user: userId, status: 'Currently Reading' }).populate('book');
  
  // ৩. পেইজ রিড ক্যালকুলেশন (সিম্পল এগ্রিগেশন)
  const totalProgress = await Library.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$progress" } } }
  ]);

  // ৪. রিডিং চ্যালেঞ্জ গোল (২০২৬ এর জন্য)
  const challengeGoal = 50; // এটি আপনি চাইলে ইউজার মডেল থেকেও আনতে পারেন

  // ৫. রিকমেন্ডেশন (ইউজারের পছন্দের ওপর ভিত্তি করে বা র‍্যান্ডম কিছু বই)
  const recommendations = await Book.find({ isDeleted: false }).limit(4);

  // ৬. সোশাল অ্যাক্টিভিটি (সিমুলেটেড ডাটা - রিকয়ারমেন্ট অনুযায়ী)
  const activities = [
    { userName: "Alex M.", action: "finished", target: "Dune", time: "2 hours ago", rating: 5, userPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { userName: "Sarah J.", action: "started reading", target: "The Hobbit", time: "5 hours ago", userPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  ];

  return {
    user,
    stats: {
      streak: 42, // এটি আপনার ইউজার মডেলে ট্র্যাকিং লজিক থাকলে সেখান থেকে আসবে
      pagesRead: (totalProgress[0]?.total * 3) || 0, // প্রগ্রেস থেকে একটি আনুমানিক পেইজ সংখ্যা
      booksFinished
    },
    challenge: {
      goal: challengeGoal,
      progress: booksFinished
    },
    recommendations,
    activities
  };
};

export const DashboardService = { getUserDashboardStatsFromDB };