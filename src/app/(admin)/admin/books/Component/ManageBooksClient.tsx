"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2, Search, Edit, Trash2, BookOpen, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// ============================================================
// TYPES
// ============================================================
export interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  pages: number;
  genre: {
    _id: string;
    name: string;
  };
}

// ============================================================
// API HELPER
// ============================================================
const api = {
  get: async (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`/api/v1${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
  delete: async (url: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`/api/v1${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (!response.ok) throw new Error('Delete failed');
    return response.json();
  }
};

// ============================================================
// SKELETON COMPONENTS
// ============================================================
function BooksTableSkeleton() {
  return (
    <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/30">
            <tr>
              <th className="px-6 sm:px-8 py-5">
                <div className="h-3 w-32 bg-gray-800/50 rounded" />
              </th>
              <th className="px-6 sm:px-8 py-5 hidden sm:table-cell">
                <div className="h-3 w-16 bg-gray-800/50 rounded" />
              </th>
              <th className="px-6 sm:px-8 py-5 hidden md:table-cell">
                <div className="h-3 w-20 bg-gray-800/50 rounded" />
              </th>
              <th className="px-6 sm:px-8 py-5">
                <div className="h-3 w-16 bg-gray-800/50 rounded ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <tr key={i}>
                {/* Book Info */}
                <td className="px-6 sm:px-8 py-5">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="w-10 h-14 sm:w-12 sm:h-16 bg-gray-800/50 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-4 w-32 sm:w-48 bg-gray-800/50 rounded" />
                      <div className="h-3 w-24 sm:w-32 bg-gray-800/50 rounded" />
                    </div>
                  </div>
                </td>

                {/* Genre */}
                <td className="px-6 sm:px-8 py-5 hidden sm:table-cell">
                  <div className="h-6 w-20 bg-gray-800/50 rounded-md" />
                </td>

                {/* Pages */}
                <td className="px-6 sm:px-8 py-5 hidden md:table-cell">
                  <div className="h-4 w-16 bg-gray-800/50 rounded" />
                </td>

                {/* Actions */}
                <td className="px-6 sm:px-8 py-5">
                  <div className="flex justify-end gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/50 rounded-lg sm:rounded-xl" />
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800/50 rounded-lg sm:rounded-xl" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SEARCH BAR COMPONENT
// ============================================================
function SearchBar({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#112216] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#22c55e] transition-colors"
        />
      </div>
    </div>
  );
}

// ============================================================
// BOOKS TABLE COMPONENT
// ============================================================
function BooksTable({ books, onDelete }: { books: Book[]; onDelete: (book: Book) => void }) {
  if (books.length === 0) {
    return (
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-12 sm:p-16 flex flex-col items-center justify-center gap-4">
          <BookOpen className="text-gray-600" size={48} />
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No books found. Try adjusting your search or add a new book.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/30">
            <tr>
              <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">Book Identification</th>
              <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden sm:table-cell">Genre</th>
              <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden md:table-cell">Volume</th>
              <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {books.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                {/* Book Info */}
                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="relative w-10 h-14 sm:w-12 sm:h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                      {book.coverImage && (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs sm:text-sm text-gray-200 truncate">
                        {book.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Genre */}
                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden sm:table-cell">
                  <span className="bg-[#22c55e]/10 text-[#22c55e] text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-1 rounded-md uppercase whitespace-nowrap inline-block">
                    {book.genre?.name || 'Unassigned'}
                  </span>
                </td>

                {/* Pages */}
                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs sm:text-sm text-gray-400 hidden md:table-cell">
                  {book.pages || 'N/A'} Pages
                </td>

                {/* Actions */}
                <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                  <div className="flex justify-end gap-2 sm:gap-3">
                    <Link
                      href={`/admin/books/edit/${book._id}`}
                      className="p-2 sm:p-2.5 bg-blue-500/10 text-blue-400 rounded-lg sm:rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(book)}
                      className="p-2 sm:p-2.5 bg-red-500/10 text-red-400 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// DELETE MODAL COMPONENT
// ============================================================
function DeleteBookModal({
  book,
  loading,
  onConfirm,
  onClose,
}: {
  book: Book;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#112216] border border-gray-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500 flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Delete Book</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Book Info Card */}
        <div className="bg-black/20 p-4 rounded-xl border border-gray-800/50 flex items-center gap-4 mb-8">
          <div className="relative w-12 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-bold truncate text-sm sm:text-base">{book.title}</h4>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
              {book.author} • {book.genre?.name || 'Unassigned'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-400 font-bold hover:text-white transition-colors text-xs sm:text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-[#e11d48] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MANAGE BOOKS CLIENT COMPONENT
// ============================================================
export function ManageBooksClient() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/books');
      
      if (res.success) {
        setBooks(res.data || []);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err: any) {
      console.error('Failed to fetch books:', err);
      setError(err.message || 'Failed to fetch library data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const openDeleteModal = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;

    try {
      setDeleteLoading(true);
      const res = await api.delete(`/admin/books/${selectedBook._id}`);
      
      if (res.success) {
        setShowModal(false);
        setSelectedBook(null);
        await fetchBooks(); // Refresh the list
      } else {
        alert('Failed to delete book');
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.message || 'Delete request failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeModal = () => {
    if (!deleteLoading) {
      setShowModal(false);
      setSelectedBook(null);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="relative min-h-screen space-y-6 animate-in fade-in duration-700">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
          <div>
            <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-800/50 rounded mb-2" />
            <div className="h-4 w-32 sm:w-40 bg-gray-800/50 rounded" />
          </div>
          <div className="h-10 w-32 sm:w-40 bg-gray-800/50 rounded-xl" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="animate-pulse">
          <div className="h-12 w-full max-w-sm bg-gray-800/50 rounded-xl" />
        </div>

        {/* Table Skeleton */}
        <BooksTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-center max-w-md">
          <p className="text-lg sm:text-xl font-bold mb-2">Failed to Load Books</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#22c55e] text-black rounded-lg text-xs sm:text-sm font-bold hover:bg-[#1bb054] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white tracking-tight">
            Manage Books
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Total {books.length} title{books.length !== 1 ? 's' : ''} available.
          </p>
        </div>
        <Link
          href="/admin/books/add"
          className="bg-[#22c55e] text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1bb054] transition-all shadow-lg shadow-[#22c55e]/20 text-xs sm:text-sm w-full md:w-auto justify-center"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add New Book
        </Link>
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Books Table */}
      <BooksTable
        books={filteredBooks}
        onDelete={openDeleteModal}
      />

      {/* Delete Confirmation Modal */}
      {showModal && selectedBook && (
        <DeleteBookModal
          book={selectedBook}
          loading={deleteLoading}
          onConfirm={confirmDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}