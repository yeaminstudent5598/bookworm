import { NextResponse } from 'next/server';
import { BookService } from './book.service';
import { BookValidation } from './book.validation';

const createBook = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = BookValidation.createBookSchema.parse(body);
    const result = await BookService.createBookInDB(validatedData);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getAllBooks = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const result = await BookService.getAllBooksFromDB(query);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const BookController = { createBook, getAllBooks };