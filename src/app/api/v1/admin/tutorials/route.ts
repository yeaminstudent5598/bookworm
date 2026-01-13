import { TutorialController } from "@/modules/tutorial/tutorial.controller";

export async function GET() {
  return TutorialController.getAllTutorials();
}

export async function POST(req: Request) {
  return TutorialController.createTutorial(req);
}