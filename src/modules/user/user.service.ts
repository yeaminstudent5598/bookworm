import { User } from './user.model';
import { IUser } from './user.interface';

const getMyProfileFromDB = async (email: string) => {
  return await User.findOne({ email }).populate('preferences');
};

const updateMyProfileInDB = async (email: string, payload: Partial<IUser>) => {
  return await User.findOneAndUpdate({ email }, payload, { new: true });
};

export const UserService = { getMyProfileFromDB, updateMyProfileInDB };