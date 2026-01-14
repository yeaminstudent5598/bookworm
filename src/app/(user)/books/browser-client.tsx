// app/(user)/books/browse-client.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Star, Check, ChevronLeft,
  ChevronRight, Loader2, BookOpen,
  Plus, Filter, X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BooksBrowseSkeleton } from '@/skeletons';

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

interface Genre {
  _id: string;
  name: string;
}

interface Meta {
  totalPages: number;
  total: number;
  currentPage: number;
}

interface BrowseClientProps {
  initialPage: number;
  initialSearch: string;
  initialGenre: string;
  initialRating: number;
  initialSort: string;
}

const BrowseLibraryClient = ({
  initialPage = 1,
  initialSearch = '',
  initialGenre = '',
  initialRating = 1,
  initialSort = 'Top Rated'
}: BrowseClientProps) => {
  //   ALL HOOKS AT TOP
  const [books, setBooks] = useState<IBook[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta>({ totalPages: 1, total: 0, currentPage: 1 });

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialGenre ? initialGenre.split(',') : []
  );
  const [ratingRange, setRatingRange] = useState(initialRating);
  const [sortBy, setSortBy] = useState(initialSort);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [genresLoading, setGenresLoading] = useState(true);
  
  //   NEW: Mobile filter panel state
  const [showFilters, setShowFilters] = useState(false);

  //   Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/api/v1/genres');
        if (res.data.success) {
          setGenres(res.data.data);
        }
      } catch (err) {
        console.error('Genre fetch failed:', err);
      } finally {
        setGenresLoading(false);
      }
    };
    fetchGenres();
  }, []);

  //   Fetch books with filters
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const [booksRes, libraryRes] = await Promise.all([
        axios.get('/api/v1/books', {
          params: {
            searchTerm,
            rating: ratingRange,
            genre: selectedGenres.join(','),
            sort: sortBy,
            page: currentPage,
            limit: 12
          },
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/v1/user/library', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (booksRes.data.success) {
        const booksList = booksRes.data.data;
        const libraryData = libraryRes.data.data;

        // Merge user library status
        const mergedBooks = booksList.map((book: any) => {
          let userStatus: 'Want to Read' | 'Currently Reading' | 'Read' | undefined;

          if (libraryData?.currentlyReading?.find((i: any) => i.book._id === book._id)) {
            userStatus = 'Currently Reading';
          } else if (libraryData?.wantToRead?.find((i: any) => i.book._id === book._id)) {
            userStatus = 'Want to Read';
          } else if (libraryData?.read?.find((i: any) => i.book._id === book._id)) {
            userStatus = 'Read';
          }

          return { ...book, status: userStatus };
        });

        setBooks(mergedBooks);
        setMeta(booksRes.data.meta);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, ratingRange, selectedGenres, sortBy, currentPage]);

  //   Fetch books when filters change
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  //   Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  //   Update shelf status
  const handleShelfUpdate = async (bookId: string, status: 'Want to Read' | 'Currently Reading' | 'Read') => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        '/api/v1/user/library',
        { bookId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchBooks();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update shelf');
    }
  };

  //   Show skeleton while initial loading
  if (loading && books.length === 0) {
    return <BooksBrowseSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] text-white">
      <div className="flex flex-col lg:flex-row">
        
        {/*   SIDEBAR - Desktop Only */}
        <aside className="hidden lg:block w-72 p-8 border-r border-white/5 bg-[#0a1410] space-y-8 sticky top-0 h-screen overflow-y-auto">
          <h2 className="text-2xl font-serif font-bold">Filters</h2>

          {/* Genre Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              📚 Genres
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {genres.map((genre) => (
                <label key={genre._id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedGenres.includes(genre._id)}
                    onChange={() => {
                      setSelectedGenres((prev) =>
                        prev.includes(genre._id)
                          ? prev.filter((id) => id !== genre._id)
                          : [...prev, genre._id]
                      );
                      handleFilterChange();
                    }}
                  />
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                      selectedGenres.includes(genre._id)
                        ? 'bg-[#00d84a] border-[#00d84a]'
                        : 'border-gray-700 group-hover:border-[#00d84a]'
                    }`}
                  >
                    {selectedGenres.includes(genre._id) && (
                      <Check size={12} className="text-black font-black" />
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      selectedGenres.includes(genre._id)
                        ? 'text-white font-bold'
                        : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    {genre.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                ⭐ Min Rating
              </h3>
              <span className="text-lg font-bold text-[#00d84a]">
                {ratingRange.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={ratingRange}
              onChange={(e) => {
                setRatingRange(parseFloat(e.target.value));
                handleFilterChange();
              }}
              className="w-full accent-[#00d84a] cursor-pointer h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.0</span>
              <span>5.0</span>
            </div>
          </div>
        </aside>

        {/*   MOBILE FILTER PANEL - Sliding Overlay */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          >
            <div 
              className="w-4/5 max-w-sm h-full bg-[#0a1410] border-r border-white/5 p-6 overflow-y-auto animate-in slide-in-from-left duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Genre Filter */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                  📚 Genres
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {genres.map((genre) => (
                    <label key={genre._id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedGenres.includes(genre._id)}
                        onChange={() => {
                          setSelectedGenres((prev) =>
                            prev.includes(genre._id)
                              ? prev.filter((id) => id !== genre._id)
                              : [...prev, genre._id]
                          );
                          handleFilterChange();
                        }}
                      />
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                          selectedGenres.includes(genre._id)
                            ? 'bg-[#00d84a] border-[#00d84a]'
                            : 'border-gray-700 group-hover:border-[#00d84a]'
                        }`}
                      >
                        {selectedGenres.includes(genre._id) && (
                          <Check size={12} className="text-black font-black" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          selectedGenres.includes(genre._id)
                            ? 'text-white font-bold'
                            : 'text-gray-500 group-hover:text-gray-300'
                        }`}
                      >
                        {genre.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Slider */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                    ⭐ Min Rating
                  </h3>
                  <span className="text-lg font-bold text-[#00d84a]">
                    {ratingRange.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={ratingRange}
                  onChange={(e) => {
                    setRatingRange(parseFloat(e.target.value));
                    handleFilterChange();
                  }}
                  className="w-full accent-[#00d84a] cursor-pointer h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1.0</span>
                  <span>5.0</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-[#00d84a] text-black font-bold rounded-lg hover:bg-[#00d84a]/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/*   MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 md:space-y-10">
          
          {/* Header & Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight">
                Browse Library
              </h1>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:border-white/20 transition-all w-full sm:w-auto">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleFilterChange();
                  }}
                  className="bg-transparent text-white text-xs sm:text-sm font-bold outline-none cursor-pointer flex-1 sm:flex-none"
                >
                  <option value="Top Rated" className="bg-[#0a1410]">
                    Top Rated
                  </option>
                  <option value="Newest" className="bg-[#0a1410]">
                    Newest
                  </option>
                  <option value="Most Reviewed" className="bg-[#0a1410]">
                    Most Reviewed
                  </option>
                </select>
              </div>
            </div>

            {/* Search Bar + Mobile Filter Button */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm focus:border-[#00d84a] focus:ring-1 focus:ring-[#00d84a]/30 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>

              {/*   Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Filter size={18} />
                <span className="text-sm font-bold hidden xs:inline">Filters</span>
              </button>
            </div>

            {/*   Active Filters Pills */}
            {(selectedGenres.length > 0 || ratingRange > 1) && (
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genreId) => {
                  const genre = genres.find(g => g._id === genreId);
                  return genre ? (
                    <span
                      key={genreId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00d84a]/10 border border-[#00d84a]/30 rounded-full text-xs text-[#00d84a]"
                    >
                      {genre.name}
                      <button
                        onClick={() => {
                          setSelectedGenres(prev => prev.filter(id => id !== genreId));
                          handleFilterChange();
                        }}
                        className="hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ) : null;
                })}
                {ratingRange > 1 && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00d84a]/10 border border-[#00d84a]/30 rounded-full text-xs text-[#00d84a]">
                    Rating ≥ {ratingRange.toFixed(1)}
                    <button
                      onClick={() => {
                        setRatingRange(1);
                        handleFilterChange();
                      }}
                      className="hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/*   Books Grid - Fully Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onAddToShelf={handleShelfUpdate}
              />
            ))}
          </div>

          {/* Empty State */}
          {books.length === 0 && !loading && (
            <div className="py-16 sm:py-20 text-center space-y-4 sm:space-y-6">
              <BookOpen size={48} className="mx-auto text-gray-600 sm:w-16 sm:h-16" />
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-2">No books found</h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            </div>
          )}

          {/*   Improved Pagination - Mobile Friendly */}
          {meta.totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-8 sm:pt-12 border-t border-white/5">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-[#00d84a] hover:border-[#00d84a] disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>

                {/* Smart Pagination - Show fewer on mobile */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {currentPage > 2 && meta.totalPages > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-500 hover:border-[#00d84a] hover:text-[#00d84a] transition-all"
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="text-gray-500 px-1">...</span>}
                    </>
                  )}

                  {[...Array(Math.min(3, meta.totalPages))].map((_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === meta.totalPages) {
                      pageNum = meta.totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    if (pageNum < 1 || pageNum > meta.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#00d84a] text-black shadow-lg shadow-[#00d84a]/30'
                            : 'bg-white/5 border border-white/10 text-gray-500 hover:border-[#00d84a] hover:text-[#00d84a]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {currentPage < meta.totalPages - 1 && meta.totalPages > 3 && (
                    <>
                      {currentPage < meta.totalPages - 2 && <span className="text-gray-500 px-1">...</span>}
                      <button
                        onClick={() => setCurrentPage(meta.totalPages)}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-gray-500 hover:border-[#00d84a] hover:text-[#00d84a] transition-all"
                      >
                        {meta.totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={currentPage === meta.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-[#00d84a] hover:border-[#00d84a] disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Results Info */}
              <div className="text-xs sm:text-sm text-gray-500">
                Showing {books.length} of {meta.total} books
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

  
interface BookCardProps {
  book: IBook;
  onAddToShelf: (bookId: string, status: 'Want to Read' | 'Currently Reading' | 'Read') => Promise<void>;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToShelf }) => {
  const [updating, setUpdating] = useState(false);

  const handleClick = async () => {
    setUpdating(true);
    await onAddToShelf(book._id, 'Want to Read');
    setUpdating(false);
  };

  return (
    <div className="group space-y-2 sm:space-y-3 md:space-y-4 animate-in fade-in duration-500">
      {/* Cover Image */}
      <Link href={`/books/${book._id}`} className="block">
        <div className="relative aspect-[3/4.5] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(0,216,74,0.2)] transition-all duration-300">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Book Info */}
      <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 px-1">
        <Link href={`/books/${book._id}`}>
          <h3 className="font-bold text-xs sm:text-sm md:text-base font-serif line-clamp-2 group-hover:text-[#00d84a] transition-colors leading-tight">
            {book.title}
          </h3>
        </Link>

        <p className="text-[10px] sm:text-xs text-gray-500 italic truncate">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Star size={12} className="fill-[#fbbf24] text-[#fbbf24] sm:w-3.5 sm:h-3.5" />
          <span className="text-xs sm:text-sm font-bold">{book.averageRating?.toFixed(1) || '0.0'}</span>
          <span className="text-[10px] sm:text-xs text-gray-600">({book.totalReviews || 0})</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={!!book.status || updating}
        onClick={handleClick}
        className={`w-full py-2 sm:py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
          book.status === 'Currently Reading'
            ? 'bg-[#00d84a] text-black shadow-lg shadow-[#00d84a]/30'
            : book.status === 'Want to Read' || book.status === 'Read'
            ? 'bg-white/5 border border-[#00d84a]/30 text-[#00d84a]'
            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-[#00d84a] hover:text-black hover:border-[#00d84a]'
        }`}
      >
        {updating ? (
          <Loader2 size={12} className="animate-spin" />
        ) : book.status === 'Currently Reading' ? (
          <>
            <Check size={10} className="sm:w-3 sm:h-3" strokeWidth={3} /> Reading
          </>
        ) : book.status === 'Want to Read' ? (
          <>
            <Check size={10} className="sm:w-3 sm:h-3" /> Wishlist
          </>
        ) : book.status === 'Read' ? (
          <>
            <Check size={10} className="sm:w-3 sm:h-3" /> Read
          </>
        ) : (
          <>
            <Plus size={10} className="sm:w-3 sm:h-3" strokeWidth={3} /> 
            <span className="hidden xs:inline">Want to Read</span>
            <span className="xs:hidden">Add</span>
          </>
        )}
      </button>
    </div>
  );
};

export default BrowseLibraryClient;