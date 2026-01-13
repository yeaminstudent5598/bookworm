"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Search, Loader2, BookOpen, AlertCircle, RefreshCw, AlertTriangle, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ManageBooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // মোডাল স্টেট
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/v1/books'); 
      if (res.data.success) {
        setBooks(res.data.data || []);
      }
    } catch (err: any) {
      setError("Failed to fetch library data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ডিলিট মোডাল ওপেন করার ফাংশন
  const openDeleteModal = (book: any) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // আসল ডিলিট রিকোয়েস্ট ফাংশন
  const confirmDelete = async () => {
    if (!selectedBook) return;
    
    try {
      setDeleteLoading(true);
      const res = await axios.delete(`/api/v1/admin/books/${selectedBook._id}`);
      if (res.data.success) {
        setShowModal(false);
        fetchBooks();
      }
    } catch (err: any) {
      alert("Delete request failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen space-y-6 animate-in fade-in duration-700">
      
      {/* Header & Search Sections (আগের মতোই থাকবে) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Manage Books</h1>
          <p className="text-gray-500 text-sm mt-1">Total {books.length} titles available.</p>
        </div>
        <Link href="/admin/books/add" className="bg-[#22c55e] text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1bb054] transition-all">
          <Plus size={18} /> Add New Book
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Search books..." 
            className="w-full bg-[#112216] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-[#22c55e]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#22c55e]" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-800 bg-black/30">
                <tr>
                  <th className="px-8 py-5">Book Identification</th>
                  <th className="px-8 py-5">Genre</th>
                  <th className="px-8 py-5">Volume</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-5">
                      <div className="relative w-12 h-16 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                        <Image src={book.coverImage || "/placeholder-book.png"} alt={book.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-200">{book.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                        {book.genre?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-400">
                      {book.pages || "N/A"} Pages
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/books/edit/${book._id}`} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                          <Edit size={16}/>
                        </Link>
                        {/* ডিলিট বাটন এখন মোডাল ওপেন করবে */}
                        <button 
                          onClick={() => openDeleteModal(book)} 
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- কাস্টম ডিলিট মোডাল (image_1de90b.png অনুযায়ী) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !deleteLoading && setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-[#112216] border border-gray-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-300">
            {/* Close Icon */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header with Icon */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Book</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
            </div>

            {/* Selected Book Info Card */}
            <div className="bg-black/20 p-4 rounded-xl border border-gray-800/50 flex items-center gap-4 mb-8">
               <div className="relative w-12 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
                  <Image 
                    src={selectedBook?.coverImage || "/placeholder-book.png"} 
                    alt="Cover" fill className="object-cover" 
                  />
               </div>
               <div>
                  <h4 className="text-white font-bold">{selectedBook?.title}</h4>
                  <p className="text-xs text-gray-500">{selectedBook?.author} • {selectedBook?.genre?.name}</p>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)}
                disabled={deleteLoading}
                className="px-6 py-2.5 text-gray-400 font-bold hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-[#e11d48] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooksPage;