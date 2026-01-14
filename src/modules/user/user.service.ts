import { User } from './user.model';

const getAllUsersFromDB = async () => {
  return await User.find({ isDeleted: false }).sort({ createdAt: -1 });
};

const updateUserRoleInDB = async (id: string, role: string) => {
  return await User.findByIdAndUpdate(id, { role }, { new: true });
};

const deleteUserFromDB = async (id: string) => {
  return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const getMyProfileFromDB = async (email: string) => {
  return await User.findOne({ email, isDeleted: false }).populate('preferences');
};

// ✅ Secure method: Get user by ID from JWT token
const getMyProfileByIDFromDB = async (id: string) => {
  return await User.findOne({ _id: id, isDeleted: false })
    .select('-password')  // Exclude password field
    .populate('preferences');  // Include preferences if needed
};

const getUserGrowthStats = async () => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return monthNames.map((month, index) => {
    const found = stats.find(s => s._id === index + 1);
    const count = found ? found.count : 0;
    return {
      month,
      count,
      percentage: (count / maxCount) * 100 
    }
  });
};

export const UserService = { 
  getAllUsersFromDB, 
  updateUserRoleInDB, 
  deleteUserFromDB, 
  getMyProfileFromDB,
  getMyProfileByIDFromDB,
  getUserGrowthStats,
};