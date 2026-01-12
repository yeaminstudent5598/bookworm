import { Tutorial } from './tutorial.model';

const createTutorialInDB = async (payload: any) => await Tutorial.create(payload);
const getAllTutorialsFromDB = async () => await Tutorial.find();
const deleteTutorialFromDB = async (id: string) => await Tutorial.findByIdAndDelete(id);

export const TutorialService = { createTutorialInDB, getAllTutorialsFromDB, deleteTutorialFromDB };