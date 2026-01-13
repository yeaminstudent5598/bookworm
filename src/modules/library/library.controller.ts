import { NextResponse } from 'next/server';
import { LibraryService } from './library.service';
import { LibraryValidation } from './library.validation';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/jwt'; 


const updateLibraryStatus = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) throw new Error("Unauthorized!");
    const decodedUser = verifyToken(token);
    if (!decodedUser) throw new Error("Invalid Token!");

    const validatedData = LibraryValidation.updateLibrarySchema.parse(body);

    const result = await LibraryService.updateLibraryInDB(decodedUser.id, validatedData);
    
    return NextResponse.json({ success: true, message: "Library updated!", data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};


const getMyLibrary = async (req: Request) => {
  try {
    await dbConnect();
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) throw new Error("Unauthorized! No token found.");

    const decodedUser = verifyToken(token);
    if (!decodedUser) throw new Error("Unauthorized! Invalid session.");

    const result = await LibraryService.getMyCategorizedLibraryFromDB(decodedUser.id);
    
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const LibraryController = { updateLibraryStatus, getMyLibrary };