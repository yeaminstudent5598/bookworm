import { NextResponse } from 'next/server';
import { TutorialService } from './tutorial.service';
import dbConnect from '@/lib/dbConnect';

const getAllTutorials = async () => {
  try {
    await dbConnect();
    const result = await TutorialService.getAllTutorialsFromDB();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const createTutorial = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    
    console.log("Request Body:", body);

    const result = await TutorialService.createTutorialInDB(body);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Tutorial Creation Error:", err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Failed to create tutorial" 
    }, { status: 400 });
  }
};

const updateTutorial = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const body = await req.json();
    const result = await TutorialService.updateTutorialInDB(id, body);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteTutorial = async (id: string) => {
  try {
    await dbConnect();
    await TutorialService.deleteTutorialFromDB(id);
    return NextResponse.json({ success: true, message: "Tutorial deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const TutorialController = { getAllTutorials, createTutorial, updateTutorial, deleteTutorial };