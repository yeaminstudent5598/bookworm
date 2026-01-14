import { Metadata } from 'next';
import { EditBookClient } from './EditBookClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; 

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/books/${id}`, {
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error();
    
    const data = await res.json();
    const book = data.data;

    return {
      title: `Edit ${book.title} - BookWorm Admin`,
      description: `Update details for ${book.title} by ${book.author}`,
    };
  } catch {
    return {
      title: 'Edit Book - BookWorm Admin',
    };
  }
}

export default async function EditBookPage({ params }: PageProps) {
  const { id } = await params; 

  const [genresData, bookData] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/genres`, {
      next: { revalidate: 3600 } 
    }).then(res => res.json()).catch(() => ({ data: [] })),
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/books/${id}`, {
      cache: 'no-store' 
    }).then(res => res.json()).catch(() => null)
  ]);

  const genres = genresData.data || [];
  const book = bookData?.data || null;

  if (!book) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 px-4 bg-[#05140b] text-white">
        <div className="p-10 bg-[#112216] border border-white/5 rounded-[3rem] text-center shadow-2xl">
          <p className="text-2xl font-serif font-bold text-red-500 mb-2">Book Not Found</p>
          <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
            The requested book could not be loaded or doesn't exist in our library.
          </p>
          <a 
            href="/admin/books"
            className="px-8 py-3 bg-[#22c55e] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all inline-block"
          >
            Back to Books List
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <EditBookClient
        bookId={id}
        initialBook={book}
        genres={genres}
      />
    </div>
  );
}