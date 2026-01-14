// app/(user)/books/[id]/page.tsx
import { ReactNode } from 'react';
import BookDetailsClient from './book-details-client';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// ডেটা ফেচিং ফাংশন - Server Side
async function fetchBook(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bookworm-xi-blond.vercel.app';
    
    console.log('🔍 Fetching book from:', `${API_URL}/api/v1/books/${id}`);
    
    const res = await fetch(`${API_URL}/api/v1/books/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Server-side এ authorization header পাঠাতে পারো যদি তোমার API এটা চায়
        // 'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}` 
      },
      next: { 
        revalidate: 3600, // ISR: প্রতি ঘণ্টায় revalidate হবে
        tags: [`book-${id}`] // On-demand revalidation এর জন্য tag
      }
    });

    console.log('📊 Response status:', res.status);

    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} - ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log('  Book data fetched successfully');
    
    return data;
  } catch (error) {
    console.error('⚠️ Fetch error:', error);
    return null;
  }
}

// মেটাডাটা জেনারেশন - SEO
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await fetchBook(id);
  
  if (!data?.success || !data?.data) {
    return {
      title: 'Book Not Found',
      description: 'The requested book could not be found.',
    };
  }

  const book = data.data;
  return {
    title: `${book.title} by ${book.author} | BookWorm`,
    description: book.description?.substring(0, 160) || 'Discover and track your reading journey',
    openGraph: {
      title: book.title,
      description: book.description,
      images: [{ url: book.coverImage }],
      type: 'website',
    },
  };
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;
  const bookData = await fetchBook(id);

  if (!bookData?.success || !bookData?.data) {
    console.error('📌 Book not found, showing 404 page');
    notFound();
  }

  return (
    <BookDetailsClient 
      initialBook={bookData.data} 
      bookId={id}
    />
  );
}