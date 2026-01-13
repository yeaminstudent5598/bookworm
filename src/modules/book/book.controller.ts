import { NextResponse } from 'next/server';
import { BookService } from './book.service';
import { BookValidation } from './book.validation';
import { uploadToCloudinary } from '@/lib/cloudinary';
import dbConnect from '@/lib/dbConnect';

// নতুন বই তৈরি করা
const createBook = async (req: Request) => {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get('photo') as File;

    const data = {
      title: formData.get('title'),
      author: formData.get('author'),
      genre: formData.get('genre'),
      description: formData.get('description'),
      pages: formData.get('pages'),
      pubYear: formData.get('pubYear'),
    };

    const validatedData = BookValidation.createBookSchema.parse(data);
    if (!file) throw new Error("Cover image is required");
    
    const uploadRes = await uploadToCloudinary(file, 'book_covers');
    const result = await BookService.createBookInDB({
      ...validatedData,
      coverImage: uploadRes.url
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getAllBooks = async (req: Request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    const query = {
      searchTerm: searchParams.get('searchTerm'),
      genre: searchParams.get('genre'),
      sort: searchParams.get('sort'), 
      rating: searchParams.get('rating'),
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 12,
    };

    const result = await BookService.getAllBooksFromDB(query);

    return NextResponse.json({ 
      success: true, 
      data: result.data, 
      meta: result.meta 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const getSingleBook = async (id: string) => {
  try {
    await dbConnect();
    const result = await BookService.getSingleBookFromDB(id);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const updateBook = async (req: Request, id: string) => {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    
    const updateData: any = {
      title: formData.get('title'),
      author: formData.get('author'),
      genre: formData.get('genre'),
      description: formData.get('description'),
      pages: Number(formData.get('pages')),
      pubYear: Number(formData.get('pubYear')),
    };

    if (file && file.size > 0) {
      const uploadRes = await uploadToCloudinary(file, 'book_covers');
      updateData.coverImage = uploadRes.url;
    }

    const result = await BookService.updateBookInDB(id, updateData);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

const deleteBook = async (id: string) => {
  try {
    await dbConnect();
    await BookService.deleteBookFromDB(id);
    return NextResponse.json({ success: true, message: "Book deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

export const BookController = { createBook, getAllBooks, deleteBook, getSingleBook, updateBook };