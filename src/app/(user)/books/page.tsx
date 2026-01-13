"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Star, Check, ChevronLeft, 
  ChevronRight, Loader2, BookOpen 
} from 'lucide-react';
import Image from 'next/image';

// --- Interfaces ---
interface IBook {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  genre: { _id: string; name: string };
  isBestseller?: boolean;
  isNew?: boolean;
  status?: 'Want to Read' | 'Currently Reading' | 'Read'; 
}

const BrowseLibrary = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search States
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState(1.0);
  const [sortBy, setSortBy] = useState('Top Rated');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/api/v1/genres');
        if (res.data.success) setGenres(res.data.data);
      } catch (err) {
        console.error("Genre fetch failed");
      }
    };
    fetchGenres();
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/books', {
        params: {
          genre: selectedGenres.join(','),
          minRating: ratingRange,
          sort: sortBy,
          searchTerm: searchTerm,
          page: currentPage,
          limit: 12
        }
      });
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenres, ratingRange, sortBy, searchTerm, currentPage]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) ? prev.filter(g => g !== genreId) : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  // ৩. সেলফ আপডেট লজিক (Zod Validation Error Fixed)
  const handleShelfUpdate = async (bookId: string, currentStatus: string | undefined) => {
    try {
      const token = localStorage.getItem("accessToken"); 

      // ✅ 'Reading' নয়, ব্যাকঅ্যান্ডের রিকয়ারমেন্ট অনুযায়ী 'Currently Reading' পাঠানো হচ্ছে
      const newStatus = currentStatus === 'Currently Reading' ? 'Want to Read' : 'Currently Reading';

      const res = await axios.patch(
        `/api/v1/user/library`, 
        { bookId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      if (res.data.success) {
        fetchBooks(); 
      }
    } catch (err: any) {
      console.error("Update Error:", err.response?.data?.message);
      alert(err.response?.data?.message || "Failed to update shelf");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#05140b] text-white transition-colors duration-500">
      
      {/* --- Left Sidebar (Filters) --- */}
      <aside className="w-full lg:w-72 p-6 border-r border-gray-800 bg-[#05140b] space-y-8 h-fit lg:sticky lg:top-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif">Filters</h2>
          <button 
            onClick={() => {setSelectedGenres([]); setRatingRange(1.0); setSearchTerm("");}}
            className="text-[#22c55e] text-xs hover:underline font-bold"
          >Reset All</button>
        </div>

        {/* Dynamic Genre Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Genres</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {genres.map(genre => (
              <label key={genre._id} className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => toggleGenre(genre._id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    selectedGenres.includes(genre._id) ? 'bg-[#22c55e] border-[#22c55e]' : 'border-gray-600 group-hover:border-gray-400'
                  }`}
                >
                  {selectedGenres.includes(genre._id) && <Check size={14} className="text-black font-bold" />}
                </div>
                <span className={`text-sm ${selectedGenres.includes(genre._id) ? 'text-white' : 'text-gray-400'}`}>{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Min Rating</h3>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-[#22c55e] font-bold">{ratingRange} ★</span>
          </div>
          <input 
            type="range" min="1" max="5" step="0.5" value={ratingRange} 
            onChange={(e) => setRatingRange(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
          />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 lg:p-10 space-y-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold font-serif tracking-tight">Browse Library</h1>
            <p className="text-gray-500 text-sm mt-1 italic">Discover your next great adventure...</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="text" 
                placeholder="Search by title or author..."
                className="w-full bg-[#112216] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[#22c55e] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#112216] border border-gray-800 text-sm px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#22c55e]"
              >
                <option value="Top Rated">Top Rated</option>
                <option value="Newest">Newest</option>
                <option value="Popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#22c55e]" size={48} />
            <p className="text-gray-600 font-serif italic">Opening the vault...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <div key={book._id} className="group space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-[#112216] border border-gray-800 group-hover:border-[#22c55e]/50 transition-all duration-500 shadow-2xl">
                  <Image src={book.coverImage || "/placeholder-book.png"} alt={book.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {book.isBestseller && (
                      <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">Bestseller</span>
                    )}
                    {book.isNew && (
                      <span className="bg-[#22c55e] text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">New Arrival</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-[#22c55e] transition-colors line-clamp-1 font-serif">{book.title}</h3>
                  <p className="text-xs text-gray-500 font-medium italic">by {book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(book.rating) ? "currentColor" : "none"} className={i < Math.floor(book.rating) ? "" : "text-gray-800"} />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">{book.rating} <span className="text-gray-600 font-medium">({book.reviewsCount || 0})</span></span>
                  </div>
                </div>

                {/* ✅ স্ট্যাটাস চেক এবং বাটন টেক্সট ফিক্স করা হয়েছে */}
                <button 
                  onClick={() => handleShelfUpdate(book._id, book.status)}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    book.status === 'Currently Reading' 
                    ? 'bg-[#22c55e] text-black' 
                    : 'bg-black/40 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e] hover:text-black'
                  }`}
                >
                  {book.status === 'Currently Reading' ? <Check size={14} /> : <BookOpen size={14} />}
                  {book.status === 'Currently Reading' ? 'Currently Reading' : 'Want to Read'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-gray-600 space-y-2">
            <p className="text-xl font-serif italic">No books match your current filters.</p>
            <button onClick={() => setSelectedGenres([])} className="text-[#22c55e] text-sm underline">Clear all filters</button>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 pt-12 border-t border-gray-900">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-xl bg-[#112216] border border-gray-800 text-gray-500 hover:text-[#22c55e] disabled:opacity-30 disabled:hover:text-gray-500 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          {[1, 2, 3].map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-12 h-12 rounded-xl text-sm font-black transition-all duration-300 ${
                currentPage === page ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20' : 'bg-[#112216] border border-gray-800 text-gray-400 hover:border-[#22c55e]'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-xl bg-[#112216] border border-gray-800 text-gray-500 hover:text-[#22c55e] transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default BrowseLibrary;