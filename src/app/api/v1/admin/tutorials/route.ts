import { TutorialController } from "@/modules/tutorial/tutorial.controller";

export async function GET(req: Request) {
  return TutorialController.getAllTutorials(req);
}

export async function POST(req: Request) {
  return TutorialController.createTutorial(req);
}