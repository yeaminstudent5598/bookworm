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

// সব বইয়ের লিস্ট পাওয়া
const getAllBooks = async (req: Request) => {
  try {
    await dbConnect(); // ডাটাবেস কানেকশন নিশ্চিত করা
    const { searchParams } = new URL(req.url);
    
    // কুয়েরি প্যারামিটারগুলো সেফলি নেওয়া
    const query: any = {};
    if (searchParams.get('searchTerm')) query.searchTerm = searchParams.get('searchTerm');
    if (searchParams.get('genre')) query.genre = searchParams.get('genre');
    if (searchParams.get('sortBy')) query.sortBy = searchParams.get('sortBy');

    const result = await BookService.getAllBooksFromDB(query);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    // এখানে আসল এরর মেসেজটি পাঠানো হচ্ছে
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Internal Server Error" 
    }, { status: 400 });
  }
};

// নির্দিষ্ট একটি বইয়ের ডাটা পাওয়া
const getSingleBook = async (id: string) => {
  try {
    await dbConnect();
    const result = await BookService.getSingleBookFromDB(id);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
};

// বইয়ের ডাটা আপডেট করা
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

// বই ডিলিট করা (Soft Delete)
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