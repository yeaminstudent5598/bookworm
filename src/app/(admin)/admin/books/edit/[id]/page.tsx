import { Metadata } from 'next';
import { Suspense } from 'react';
import { EditBookClient, EditBookSkeleton } from './EditBookClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/books/${id}`, { cache: 'no-store' });
    const data = await res.json();
    return { title: `Edit ${data.data?.title || 'Book'} - Admin` };
  } catch { return { title: 'Edit Book - Admin' }; }
}

export default async function EditBookPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditBookSkeleton />}>
      <EditBookContent id={id} />
    </Suspense>
  );
}

async function EditBookContent({ id }: { id: string }) {
  const [genresData, bookData] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, { next: { revalidate: 3600 } }).then(res => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/books/${id}`, { cache: 'no-store' }).then(res => res.json())
  ]);

  const genres = genresData.data || [];
  const book = bookData?.data || null;

  if (!book) {
    return <div className="text-center py-20 text-red-500 font-bold">Book Not Found</div>;
  }

  return <EditBookClient bookId={id} initialBook={book} genres={genres} />;
}