"use client";

import React from 'react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Book } from './ManageBooksClient';

interface DeleteBookModalProps {
  book: Book;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteBookModal({
  book,
  loading,
  onConfirm,
  onClose,
}: DeleteBookModalProps) {
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
            <h3 className="text-xl font-bold text-white">Delete Book</h3>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Book Info Card */}
        <div className="bg-black/20 p-4 rounded-xl border border-gray-800/50 flex items-center gap-4 mb-8">
          <div className="relative w-12 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={book.coverImage || '/placeholder-book.png'}
              alt={book.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-bold truncate">{book.title}</h4>
            <p className="text-xs text-gray-500 truncate">
              {book.author} • {book.genre?.name || 'Unassigned'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 text-gray-400 font-bold hover:text-white transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-[#e11d48] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}