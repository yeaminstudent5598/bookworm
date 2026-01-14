// app/(user)/my-library/page.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import LibraryClient from './library-client';

interface Props {
  params: Promise<{}>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server-side data fetching
async function fetchUserLibrary(token: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    console.log('📚 Fetching user library...');

    const res = await fetch(`${API_URL}/api/v1/user/library`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: {
        revalidate: 60, // ISR: প্রতি মিনিটে revalidate
        tags: ['user-library']
      }
    });

    if (!res.ok) {
      console.error(`❌ API Error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log('✅ Library data fetched:', {
      reading: data.data?.currentlyReading?.length,
      wantToRead: data.data?.wantToRead?.length,
      read: data.data?.read?.length
    });

    return data.data;
  } catch (error) {
    console.error('⚠️ Fetch error:', error);
    return null;
  }
}

// Metadata
export const metadata = {
  title: 'My Library | BookWorm',
  description: 'Track your reading progress and manage your personal book collection'
};

export default async function MyLibraryPage() {
  
  return (
    <LibraryClient />
  );
}