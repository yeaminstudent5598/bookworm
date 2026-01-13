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

export const UserService = { 
  getAllUsersFromDB, 
  updateUserRoleInDB, 
  deleteUserFromDB, 
  getMyProfileFromDB 
};