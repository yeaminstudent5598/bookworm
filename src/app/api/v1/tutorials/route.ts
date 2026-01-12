import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TutorialService } from '@/modules/tutorial/tutorial.service';

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const result = await TutorialService.createTutorialInDB(body);
  return NextResponse.json({ success: true, data: result });
}

export async function GET() {
  await dbConnect();
  const result = await TutorialService.getAllTutorialsFromDB();
  return NextResponse.json({ success: true, data: result });
}