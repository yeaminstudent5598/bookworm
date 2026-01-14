// app/(user)/my-library/library-client.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Loader2, Plus, Star, X, CheckCircle, BookOpen,
  Flame, Trophy, Clock, ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LibrarySkeleton } from '@/skeletons';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  pages: number;
  averageRating: number;
}

interface LibraryItem {
  _id: string;
  book: Book;
  status: 'Want to Read' | 'Currently Reading' | 'Read';
  currentPage: number;
  startDate?: string;
  finishDate?: string;
}

interface LibraryData {
  currentlyReading: LibraryItem[];
  wantToRead: LibraryItem[];
  read: LibraryItem[];
}

const LibraryClient = () => {
  const [library, setLibrary] = useState<LibraryData>({
    currentlyReading: [],
    wantToRead: [],
    read: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [tempPage, setTempPage] = useState(0);
  const [updating, setUpdating] = useState(false);

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.log('⚠️ No auth token found');
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/v1/user/library', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        console.log('✅ Library loaded:', res.data.data);
        setLibrary(res.data.data);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // Show skeleton while loading
  if (loading) {
    return <LibrarySkeleton />;
  }

  const handleStartReading = async (bookId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        '/api/v1/user/library',
        { bookId, status: 'Currently Reading' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLibrary();
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to start reading');
    }
  };

  const handleUpdate = async (statusOverride?: 'Want to Read' | 'Currently Reading' | 'Read') => {
    if (!selectedItem) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem('accessToken');

      const payload = {
        bookId: selectedItem.book._id,
        currentPage: Number(tempPage),
        status: statusOverride || selectedItem.status
      };

      await axios.patch('/api/v1/user/library', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsModalOpen(false);
      await fetchLibrary();
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const calculateProgress = (currentPage: number, totalPages: number) => {
    return Math.round((currentPage / totalPages) * 100);
  };

  const totalBooks = library.currentlyReading.length + library.wantToRead.length + library.read.length;
  const totalPagesRead = library.currentlyReading.reduce((acc, item) => acc + item.currentPage, 0) +
    library.read.reduce((acc, item) => acc + item.book.pages, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-md bg-[#0a1410]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00d84a] mb-2">
                Your Collection
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">My Library</h1>
              <p className="text-gray-500 italic text-sm mt-2">
                "A library is not a luxury but one of the necessities of life." — Henry Ward Beecher
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pt-4">
              <StatCard label="Total Books" value={totalBooks} color="#00d84a" />
              <StatCard label="Reading" value={library.currentlyReading.length} color="#fbbf24" />
              <StatCard label="Finished" value={library.read.length} color="#10b981" />
              <StatCard
                label="Pages Read"
                value={totalPagesRead}
                color="#a78bfa"
                hidden={{ mobile: true }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 space-y-16 md:space-y-20">
        {library.currentlyReading.length > 0 && (
          <CurrentlyReadingSection
            books={library.currentlyReading}
            onUpdate={(item) => {
              setSelectedItem(item);
              setTempPage(item.currentPage);
              setIsModalOpen(true);
            }}
            calculateProgress={calculateProgress}
          />
        )}

        {library.wantToRead.length > 0 && (
          <WantToReadSection
            books={library.wantToRead}
            onStartReading={handleStartReading}
          />
        )}

        {library.read.length > 0 && (
          <ReadSection books={library.read} calculateProgress={calculateProgress} />
        )}

        {totalBooks === 0 && (
          <EmptyState />
        )}
      </main>

      {isModalOpen && selectedItem && (
        <UpdateProgressModal
          item={selectedItem}
          tempPage={tempPage}
          onPageChange={setTempPage}
          onClose={() => setIsModalOpen(false)}
          onSave={() => handleUpdate()}
          onMarkFinished={() => handleUpdate('Read')}
          updating={updating}
          calculateProgress={calculateProgress}
        />
      )}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  hidden?: { mobile?: boolean; tablet?: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, hidden }) => {
  const hiddenClass = hidden?.mobile ? 'hidden md:block' : '';
  return (
    <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-4 ${hiddenClass}`}>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
};

// Currently Reading Section
interface CurrentlyReadingSectionProps {
  books: LibraryItem[];
  onUpdate: (item: LibraryItem) => void;
  calculateProgress: (current: number, total: number) => number;
}

const CurrentlyReadingSection: React.FC<CurrentlyReadingSectionProps> = ({
  books,
  onUpdate,
  calculateProgress
}) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Flame size={24} className="text-[#ff6b35]" />
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Currently Reading</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            {books.length} Book{books.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {books.map((item) => {
          const progress = calculateProgress(item.currentPage, item.book.pages);
          return (
            <BookCard
              key={item._id}
              item={item}
              progress={progress}
              onUpdate={() => onUpdate(item)}
            />
          );
        })}
      </div>
    </section>
  );
};

// Want to Read Section
interface WantToReadSectionProps {
  books: LibraryItem[];
  onStartReading: (bookId: string) => Promise<void>;
}

const WantToReadSection: React.FC<WantToReadSectionProps> = ({ books, onStartReading }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Clock size={24} className="text-[#3b82f6]" />
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">Want to Read</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              {books.length} Book{books.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Link
          href="/books"
          className="text-[#00d84a] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
        >
          Explore <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
        {books.map((item) => (
          <BookCoverCard
            key={item._id}
            item={item}
            variant="wantToRead"
            onAction={() => onStartReading(item.book._id)}
          />
        ))}
        <AddBookCard />
      </div>
    </section>
  );
};

// Read Section
interface ReadSectionProps {
  books: LibraryItem[];
  calculateProgress: (current: number, total: number) => number;
}

const ReadSection: React.FC<ReadSectionProps> = ({ books }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Trophy size={24} className="text-[#fbbf24]" />
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Read</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            {books.length} Book{books.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {books.map((item) => (
          <BookCoverCard
            key={item._id}
            item={item}
            variant="read"
            showRating
          />
        ))}
      </div>
    </section>
  );
};

// Book Card (Currently Reading)
interface BookCardProps {
  item: LibraryItem;
  progress: number;
  onUpdate: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ item, progress, onUpdate }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex gap-6">
        <Link href={`/books/${item.book._id}`} className="flex-shrink-0">
          <div className="relative w-28 h-40 rounded-lg overflow-hidden shadow-lg border border-white/10 group/cover hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all">
            <Image
              src={item.book.coverImage}
              alt={item.book.title}
              fill
              className="object-cover group-hover/cover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/books/${item.book._id}`}>
              <h3 className="text-lg font-bold font-serif line-clamp-2 hover:text-[#00d84a] transition-colors">
                {item.book.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1">{item.book.author}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">
                {item.currentPage} / {item.book.pages} pages
              </span>
              <span className="text-sm font-bold text-[#00d84a]">{progress}%</span>
            </div>

            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] rounded-full transition-all duration-700 shadow-lg shadow-[#ff6b35]/40"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={onUpdate}
              className="w-full py-2.5 bg-[#ff6b35] hover:bg-[#ff8c5a] text-black rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 active:scale-95"
            >
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Book Cover Card
interface BookCoverCardProps {
  item: LibraryItem;
  variant: 'wantToRead' | 'read';
  onAction?: () => void;
  showRating?: boolean;
}

const BookCoverCard: React.FC<BookCoverCardProps> = ({
  item,
  variant,
  onAction,
  showRating
}) => {
  return (
    <Link
      href={`/books/${item.book._id}`}
      className="group flex-shrink-0 w-40 space-y-3"
    >
      <div className="relative aspect-[3/4.5] rounded-xl overflow-hidden shadow-lg border border-white/10 bg-white/5">
        <Image
          src={item.book.coverImage}
          alt={item.book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {variant === 'wantToRead' && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAction?.();
              }}
              className="bg-[#00d84a] text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#00d84a]/40 transition-all"
            >
              Start Reading
            </button>
          </div>
        )}

        {showRating && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 shadow-lg">
            {item.book.averageRating?.toFixed(1) || '0.0'} <Star size={10} fill="currentColor" />
          </div>
        )}

        {variant === 'read' && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <CheckCircle size={40} className="text-[#10b981]" />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold line-clamp-2 group-hover:text-[#00d84a] transition-colors">
          {item.book.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{item.book.author}</p>

        {variant === 'read' && (
          <div className="flex gap-0.5 mt-2 text-[#fbbf24]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.round(item.book.averageRating || 0) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

// Add Book Card
const AddBookCard = () => (
  <Link
    href="/books"
    className="group flex-shrink-0 w-40 aspect-[3/4.5] border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-[#00d84a] hover:border-[#00d84a] transition-all bg-white/5"
  >
    <Plus size={32} className="group-hover:scale-110 transition-transform" />
    <span className="text-xs font-bold mt-3 uppercase">Add Book</span>
  </Link>
);

// Empty State
const EmptyState = () => (
  <div className="py-20 text-center space-y-6">
    <BookOpen size={64} className="mx-auto text-gray-600" />
    <div>
      <h3 className="text-2xl font-serif font-bold mb-2">Your library is empty</h3>
      <p className="text-gray-500 mb-6">Start exploring books and build your personal library</p>
      <Link
        href="/books"
        className="inline-flex items-center gap-2 bg-[#00d84a] text-black px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-[#00d84a]/40 transition-all"
      >
        <Plus size={18} /> Explore Books
      </Link>
    </div>
  </div>
);

// Update Progress Modal
interface UpdateProgressModalProps {
  item: LibraryItem;
  tempPage: number;
  onPageChange: (page: number) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
  onMarkFinished: () => Promise<void>;
  updating: boolean;
  calculateProgress: (current: number, total: number) => number;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  item,
  tempPage,
  onPageChange,
  onClose,
  onSave,
  onMarkFinished,
  updating,
  calculateProgress
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-bold italic">Update Progress</h3>
            <p className="text-xs text-gray-500 mt-1">{item.book.title}</p>
          </div>

          <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Progress</span>
              <span className="font-bold text-[#00d84a]">
                {calculateProgress(tempPage, item.book.pages)}%
              </span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d84a] to-[#00ff6a] rounded-full transition-all duration-500"
                style={{
                  width: `${calculateProgress(tempPage, item.book.pages)}%`
                }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              {tempPage} / {item.book.pages} pages
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Current Page
              </label>
              <input
                type="number"
                min="0"
                max={item.book.pages}
                value={tempPage}
                onChange={(e) =>
                  onPageChange(Math.min(Number(e.target.value) || 0, item.book.pages))
                }
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-lg font-bold text-[#00d84a] outline-none focus:border-[#00d84a] focus:ring-1 focus:ring-[#00d84a]/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Total Pages
              </label>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center text-lg font-bold text-gray-400">
                {item.book.pages}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onSave}
              disabled={updating}
              className="w-full bg-gradient-to-r from-[#00d84a] to-[#00ff6a] text-black py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:shadow-lg hover:shadow-[#00d84a]/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              onClick={onMarkFinished}
              disabled={updating}
              className="w-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#10b981]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} /> Mark as Finished
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryClient;