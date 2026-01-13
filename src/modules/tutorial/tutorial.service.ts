import { Tutorial } from './tutorial.model';
import { ITutorial } from './tutorial.interface';

const getAllTutorialsFromDB = async () => {
  return await Tutorial.find({}).sort({ createdAt: -1 });
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