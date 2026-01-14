import { NextResponse } from 'next/server';
import { ShelfService } from './shelf.service';
import { ShelfValidation } from './shelf.validation';

const updateShelfStatus = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = ShelfValidation.updateShelfSchema.parse(body);
    
    const result = await ShelfService.updateShelfStatusInDB(validatedData);
    return NextResponse.json({
      success: true,
      message: 'Shelf updated successfully',
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getMyShelves = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new Error('User ID is required in query params');
    }

    const result = await ShelfService.getMyShelvesFromDB(userId);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const ShelfController = { updateShelfStatus, getMyShelves };