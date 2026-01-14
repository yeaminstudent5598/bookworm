import { Tutorial } from './tutorial.model';
import { ITutorial } from './tutorial.interface';

const getAllTutorialsFromDB = async (searchTerm?: string, page: number = 1, limit: number = 8) => {
  let query = {};
  if (searchTerm) {
    query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    };
  }

  const skip = (page - 1) * limit;
  const data = await Tutorial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Tutorial.countDocuments(query);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};


const createTutorialInDB = async (payload: ITutorial) => {
  return await Tutorial.create(payload);
};

const updateTutorialInDB = async (id: string, payload: Partial<ITutorial>) => {
  return await Tutorial.findByIdAndUpdate(
    id, 
    payload, 
    { new: true, runValidators: true }
  );
};


const deleteTutorialFromDB = async (id: string) => {
  return await Tutorial.findByIdAndDelete(id);
};

export const TutorialService = {
  getAllTutorialsFromDB,
  createTutorialInDB,
  updateTutorialInDB,
  deleteTutorialFromDB
};