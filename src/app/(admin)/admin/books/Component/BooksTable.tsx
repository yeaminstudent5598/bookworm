"use client";

import React from 'react';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from './ManageBooksClient';

interface BooksTableProps {
  books: Book[];
  onDelete: (book: Book) => void;
}

export function BooksTable({ books, onDelete }: BooksTableProps) {
  if (books.length === 0) {
    return (
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-16 flex flex-col items-center justify-center gap-4">
          <BookOpen className="text-gray-600" size={48} />
          <p className="text-gray-500 text-center">
            No books found. Try adjusting your search or add a new book.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/30">
            <tr>
              <th className="px-6 sm:px-8 py-5">Book Identification</th>
              <th className="px-6 sm:px-8 py-5 hidden sm:table-cell">Genre</th>
              <th className="px-6 sm:px-8 py-5 hidden md:table-cell">Volume</th>
              <th className="px-6 sm:px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {books.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                {/* Book Info */}
                <td className="px-6 sm:px-8 py-5">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="relative w-10 h-14 sm:w-12 sm:h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                      <Image
                        src={book.coverImage || '/placeholder-book.png'}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40px, 48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-200 truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Genre */}
                <td className="px-6 sm:px-8 py-5 hidden sm:table-cell">
                  <span className="bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-black px-2.5 py-1 rounded-md uppercase whitespace-nowrap">
                    {book.genre?.name || 'Unassigned'}
                  </span>
                </td>

                {/* Pages */}
                <td className="px-6 sm:px-8 py-5 text-sm text-gray-400 hidden md:table-cell">
                  {book.pages || 'N/A'} Pages
                </td>

                {/* Actions */}
                <td className="px-6 sm:px-8 py-5">
                  <div className="flex justify-end gap-2 sm:gap-3">
                    <Link
                      href={`/admin/books/edit/${book._id}`}
                      className="p-2 sm:p-2.5 bg-blue-500/10 text-blue-400 rounded-lg sm:rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(book)}
                      className="p-2 sm:p-2.5 bg-red-500/10 text-red-400 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 size={16} />
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