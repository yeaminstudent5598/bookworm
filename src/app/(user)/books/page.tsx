"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Star, Check, ChevronLeft, 
  ChevronRight, Loader2, BookOpen, 
  Plus, Filter 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface IBook {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  averageRating: number;
  totalReviews: number;
  genre: { _id: string; name: string };
  isBestseller?: boolean;
  status?: 'Want to Read' | 'Currently Reading' | 'Read'; 
}

const BrowseLibrary = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>({ totalPages: 1, total: 0 });
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState(1.0);
  const [sortBy, setSortBy] = useState('Top Rated'); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ১. জেনার ফেচ করা
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/api/v1/genres');
        if (res.data.success) setGenres(res.data.data);
      } catch (err) { console.error("Genre fetch failed"); }
    };
    fetchGenres();
  }, []);

  // ২. ডাইনামিক ডাটা ফেচিং
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      const [booksRes, libraryRes] = await Promise.all([
        axios.get('/api/v1/books', { 
            params: { searchTerm,rating: ratingRange, genre: selectedGenres.join(','), sort: sortBy, page: currentPage, limit: 12 },
            headers: { Authorization: `Bearer ${token}` } 
        }),
        axios.get('/api/v1/user/library', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (booksRes.data.success) {
        const booksList = booksRes.data.data;
        const libraryData = libraryRes.data.data;

        const mergedBooks = booksList.map((book: any) => {
          let userStatus = undefined;
          if (libraryData?.currentlyReading?.find((i: any) => i.book._id === book._id)) userStatus = 'Currently Reading';
          else if (libraryData?.wantToRead?.find((i: any) => i.book._id === book._id)) userStatus = 'Want to Read';
          else if (libraryData?.read?.find((i: any) => i.book._id === book._id)) userStatus = 'Read';
          return { ...book, status: userStatus };
        });

        setBooks(mergedBooks);
        setMeta(booksRes.data.meta); 
      }
    } catch (error) { console.error("Fetch Error:", error); } 
    finally { setLoading(false); }
  }, [searchTerm, ratingRange, selectedGenres, sortBy, currentPage]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleFilterChange = () => setCurrentPage(1);

  const handleShelfUpdate = async (bookId: string) => {
    try {
      const token = localStorage.getItem("accessToken"); 
      const res = await axios.patch(`/api/v1/user/library`, { bookId, status: 'Want to Read' }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) fetchBooks(); 
    } catch (err: any) { console.error("Update failed"); }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#05140b] text-white font-sans">
      
      {/* SIDEBAR - image_7dcbcd.png অনুযায়ী */}
      <aside className="w-full lg:w-72 p-8 border-r border-white/5 bg-[#05140b] space-y-10 lg:sticky lg:top-0 h-fit">
        <h2 className="text-xl font-bold font-serif">Filters</h2>
        
        {/* জেনার ফিল্টার */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Genres</h3>
          <div className="space-y-3">
            {genres.map(genre => (
              <label key={genre._id} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="hidden" checked={selectedGenres.includes(genre._id)} onChange={() => {setSelectedGenres(prev => prev.includes(genre._id) ? prev.filter(id => id !== genre._id) : [...prev, genre._id]); handleFilterChange();}} />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedGenres.includes(genre._id) ? 'bg-[#22c55e] border-[#22c55e]' : 'border-gray-700'}`}>
                  {selectedGenres.includes(genre._id) && <Check size={12} className="text-black font-black" />}
                </div>
                <span className={`text-sm ${selectedGenres.includes(genre._id) ? 'text-white font-bold' : 'text-gray-500'}`}>{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* রেটিং স্লাইডার */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Min Rating: {ratingRange.toFixed(1)}</h3>
          <input type="range" min="1" max="5" step="0.5" value={ratingRange} onChange={(e) => {setRatingRange(parseFloat(e.target.value)); handleFilterChange();}} className="w-full accent-[#22c55e]" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 space-y-10">
        
        {/* ✅ সর্টিং সেকশন - bg-[#112216] ফিক্সড */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-serif font-bold tracking-tight">Browse Library</h1>
            <div className="flex items-center gap-3 bg-[#112216] border border-white/5 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => {setSortBy(e.target.value); handleFilterChange();}} 
                className="bg-[#112216] text-white text-xs font-bold outline-none cursor-pointer"
              >
                <option value="Top Rated" className="bg-[#112216]">Top Rated</option>
                <option value="Newest" className="bg-[#112216]">Newest</option>
                <option value="Popular" className="bg-[#112216]">Popular</option>
              </select>
            </div>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input type="text" placeholder="Search books..." className="w-full bg-[#112216] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#22c55e] outline-none" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); handleFilterChange();}} />
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#22c55e]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {books.map((book) => (
              <div key={book._id} className="group animate-in fade-in duration-700">
                <Link href={`/books/${book._id}`} className="relative aspect-[3/4.5] rounded-3xl overflow-hidden bg-[#112216] border border-white/5 block shadow-2xl">
                  <Image src={book.coverImage} alt={book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                </Link>

                <div className="mt-6 space-y-3">
                  <h3 className="font-bold text-lg font-serif line-clamp-1 group-hover:text-[#22c55e] transition-colors">{book.title}</h3>
                  <p className="text-xs text-gray-500 italic mt-0.5">by {book.author}</p>
                  
                  <div className="flex items-center gap-2">
                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold">{book.averageRating || 0}</span>
                  </div>

                  {/* ডাইনামিক বাটন - image_7db44b এবং image_7e2183 অনুযায়ী */}
                  <button 
                    disabled={!!book.status}
                    onClick={() => handleShelfUpdate(book._id)}
                    className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      book.status === 'Currently Reading' 
                      ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/30' 
                      : (book.status === 'Want to Read' || book.status === 'Read')
                      ? 'bg-[#112216] border border-[#22c55e]/30 text-[#22c55e]'
                      : 'bg-[#112216] border border-white/5 text-gray-400 hover:bg-[#22c55e] hover:text-black'
                    }`}
                  >
                    {book.status === 'Currently Reading' ? (
                      <><Check size={14} strokeWidth={3}/> Reading</> 
                    ) : book.status === 'Want to Read' ? (
                      <><Check size={14} /> In Wishlist</>
                    ) : book.status === 'Read' ? (
                      <><Check size={14} /> Already Read</>
                    ) : (
                      <><Plus size={14} strokeWidth={3}/> Want to Read</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ডাইনামিক প্যাগিনেশন */}
        <div className="flex justify-center items-center gap-2 pt-16 border-t border-white/5">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 rounded-xl bg-[#112216] border border-white/5 flex items-center justify-center text-gray-600 hover:text-[#22c55e] disabled:opacity-20 transition-all"><ChevronLeft size={20}/></button>
          {[...Array(meta.totalPages || 1)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#22c55e] text-black shadow-lg' : 'bg-[#112216] border border-white/5 text-gray-500 hover:border-[#22c55e]'}`}>{i + 1}</button>
          ))}
          <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-xl bg-[#112216] border border-white/5 flex items-center justify-center text-gray-600 hover:text-[#22c55e] disabled:opacity-20 transition-all"><ChevronRight size={20}/></button>
        </div>
      </main>
    </div>
  );
};

export default BrowseLibrary;