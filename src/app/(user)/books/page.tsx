"use client";
import { useEffect, useState } from 'react';
import BookCard from '@/components/books/BookCard';
import { Search } from 'lucide-react';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/books?searchTerm=${searchTerm}`);
        const data = await res.json();
        if (data.success) setBooks(data.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchBooks, 500); // 500ms delay for search
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-[#5c4033]">Browse Library</h1>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b5e3c]" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e5d9c1] focus:ring-2 focus:ring-[#5c4033] outline-none bg-[#fdfaf1]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-[#f5ebd8] animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length > 0 ? (
            books.map((book: any) => <BookCard key={book._id} book={book} />)
          ) : (
            <p className="col-span-full text-center py-20 text-[#8b5e3c]">No books found in the library.</p>
          )}
        </div>
      )}
    </div>
  );
}