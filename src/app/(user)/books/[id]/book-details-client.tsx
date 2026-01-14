'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Star, Loader2, Send, Heart, Share2, BookmarkCheck,
  ChevronUp, Check, ArrowRight, BookOpen, MessageCircle,
  TrendingUp, Award, Clock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BookDetailsSkeleton } from '@/skeletons';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  pages: number;
  pubYear: number;
  genre: { _id: string; name: string };
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  userProgress?: {
    status: 'Want to Read' | 'Currently Reading' | 'Read';
    currentPage: number;
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
  status: 'approved' | 'pending';
}

interface ClientProps {
  initialBook: Book;
  bookId: string;
}

const BookDetailsClient = ({ initialBook, bookId }: ClientProps) => {
  // ✅ ALL HOOKS MUST BE AT TOP - Before any conditional returns
  const [book, setBook] = useState<Book>(initialBook);
  const [updating, setUpdating] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [localPage, setLocalPage] = useState<number>(initialBook?.userProgress?.currentPage ?? 0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'Want to Read' | 'Currently Reading' | 'Read'>(
    initialBook?.userProgress?.status ?? 'Want to Read'
  );
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const reviewFormRef = useRef<HTMLFormElement>(null);

  // ✅ Load user progress on mount
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/v1/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.success && res.data?.data?.userProgress) {
          const { currentPage = 0, status } = res.data.data.userProgress;
          setLocalPage(currentPage);
          setCurrentStatus(status);
          setBook(res.data.data);
        }
      } catch (err) {
        console.error('Error loading user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [bookId]);

  // ✅ Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Refresh book data callback
  const refreshBook = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`/api/v1/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBook(res.data.data);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [bookId]);

  // ✅ Update shelf status
  const handleShelfUpdate = async (status: 'Want to Read' | 'Currently Reading' | 'Read') => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        '/api/v1/user/library',
        { bookId, status, currentPage: localPage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentStatus(status);
      await refreshBook();
    } catch (err) {
      alert('Failed to update shelf');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Update reading progress
  const handleProgressUpdate = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        '/api/v1/user/library',
        { bookId, status: currentStatus, currentPage: localPage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshBook();
    } catch (err) {
      alert('Failed to update progress');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Submit review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (review.comment.length < 10) {
      alert('Review must be at least 10 characters');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');
      await axios.post(
        '/api/v1/reviews',
        { bookId, rating: review.rating, comment: review.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview({ rating: 5, comment: '' });
      await refreshBook();
      alert('Review submitted! Awaiting admin approval.');
    } catch (err) {
      alert('Error posting review');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Show skeleton while loading - NOW ALL HOOKS HAVE BEEN CALLED
  if (loading) {
    return <BookDetailsSkeleton />;
  }

  // ✅ Calculate progress
  const totalPages = book?.pages || 1;
  const progressPercent = Math.min(Math.round((localPage / totalPages) * 100), 100);
  const approvedReviews = book?.reviews?.filter(r => r.status === 'approved') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] text-white">
      {/* Scroll Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 bg-[#00d84a] text-black p-3 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(0,216,74,0.4)] transition-all hover:scale-110"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-30 bg-[#0a1410]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <Link href="/books" className="hover:text-[#00d84a] transition-colors">
              Books
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">{book.genre?.name}</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#00d84a] truncate">{book.title}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Book Cover & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Cover Image */}
              <div className="relative aspect-[3/4.5] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Key Stats */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Pages
                    </p>
                    <p className="text-lg font-bold text-[#00d84a]">{book.pages}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Rating
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg font-bold text-[#fbbf24]">
                        {book.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <Star size={12} fill="currentColor" className="text-[#fbbf24]" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                      Year
                    </p>
                    <p className="text-lg font-bold text-gray-300">{book.pubYear}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
                  >
                    <Heart size={18} className={`mx-auto transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover:scale-110'}`} />
                  </button>
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      navigator.clipboard.writeText(url);
                      alert('Link copied!');
                    }}
                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#00d84a]/10 hover:text-[#00d84a] transition-all duration-300 group"
                  >
                    <Share2 size={18} className="mx-auto group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Book Info & Features */}
          <div className="lg:col-span-8 space-y-8">
            {/* Book Metadata */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight mb-2">
                  {book.title}
                </h1>
                <p className="text-lg md:text-xl text-[#00d84a] font-serif italic font-light">
                  by {book.author}
                </p>
              </div>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed italic font-light max-w-2xl">
                "{book.description}"
              </p>
            </div>

            {/* Reading Progress Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d84a]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 space-y-8">
                
                {/* Shelf Status */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <BookmarkCheck size={14} className="text-[#00d84a]" />
                    Shelf Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Want to Read', 'Currently Reading', 'Read'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleShelfUpdate(status)}
                        disabled={updating}
                        className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border ${
                          currentStatus === status
                            ? 'bg-[#00d84a] text-black border-[#00d84a] shadow-lg shadow-[#00d84a]/30'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
                        } disabled:opacity-50`}
                      >
                        {currentStatus === status && <Check size={14} className="inline mr-1" />}
                        {status.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Tracker */}
                {currentStatus === 'Currently Reading' && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reading Progress</span>
                      <span className="text-3xl font-black text-[#00d84a]">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#00d84a] to-[#00ff6a] rounded-full transition-all duration-700 shadow-lg shadow-[#00d84a]/50"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all">
                        <input
                          type="number"
                          min="0"
                          max={book.pages}
                          className="w-16 bg-transparent text-center font-bold text-xl text-[#00d84a] outline-none"
                          value={localPage}
                          onChange={(e) => setLocalPage(Math.min(Number(e.target.value) || 0, book.pages))}
                        />
                        <span className="text-xs font-bold text-gray-500 uppercase">/ {book.pages}</span>
                      </div>
                      <button
                        onClick={handleProgressUpdate}
                        disabled={updating}
                        className="sm:ml-auto w-full sm:w-auto bg-[#00d84a] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#00d84a]/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <section className="space-y-8 border-t border-white/5 pt-8 md:pt-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold italic mb-1">Reviews</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {approvedReviews.length} Approved Review{approvedReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d84a]/10 border border-[#00d84a]/30 text-[#00d84a] font-bold text-xs uppercase tracking-widest hover:bg-[#00d84a]/20 transition-all"
                >
                  <MessageCircle size={16} /> Write Review
                </button>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedReviews.length > 0 ? (
                  approvedReviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="group bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4 hover:border-white/20 hover:bg-white/[0.05] transition-all backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                            {rev.user?.photo ? (
                              <Image src={rev.user.photo} alt={rev.user.name} width={48} height={48} className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#00d84a] to-[#00a838]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold truncate">{rev.user?.name}</h4>
                            <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-[#fbbf24] gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
                    <MessageCircle size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500 font-serif italic">No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Review Form */}
            <form ref={reviewFormRef} onSubmit={handleReviewSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d84a]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 space-y-6 md:space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold italic">Share Your Thoughts</h3>
                  <div className="flex justify-center gap-3 py-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReview({ ...review, rating: num })}
                        className="transition-all hover:scale-125"
                      >
                        <Star
                          size={36}
                          className={review.rating >= num ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-700'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    className="w-full bg-black/40 border border-white/10 p-6 rounded-xl outline-none focus:border-[#00d84a] focus:ring-1 focus:ring-[#00d84a]/30 transition-all min-h-[150px] text-gray-300 text-sm leading-relaxed resize-none"
                    placeholder="Share your thoughts about this book..."
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    maxLength={1000}
                    disabled={updating}
                  />
                  <div className="text-xs text-gray-500 text-right">{review.comment.length}/1000</div>
                </div>

                <button
                  type="submit"
                  disabled={updating || review.comment.length < 10}
                  className="w-full bg-gradient-to-r from-[#00d84a] to-[#00ff6a] text-black px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#00d84a]/40 transition-all active:scale-95 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Posting...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Post Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailsClient;