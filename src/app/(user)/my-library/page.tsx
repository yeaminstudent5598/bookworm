"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Loader2, Plus, Star, Edit3, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MyLibraryPage = () => {
  const [library, setLibrary] = useState<any>({ currentlyReading: [], wantToRead: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [tempPage, setTempPage] = useState(0);

  const handleStartReading = async (bookId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch('/api/v1/user/library', 
        { bookId, status: 'Currently Reading' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) fetchLibrary();
    } catch (err) {
      alert("Failed to start reading");
    }
  };

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get('/api/v1/user/library', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setLibrary(res.data.data);
    } catch (err) {
      console.error("Sync error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  const handleUpdate = async (statusOverride?: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        bookId: selectedItem.book._id,
        currentPage: Number(tempPage),
        totalPages: selectedItem.book.pages,
        status: statusOverride || selectedItem.status
      };
      await axios.patch('/api/v1/user/library', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchLibrary(); // ডাটা রিফ্রেশ হবে, পারসেন্টেজ বাড়বে
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#1a140f]"><Loader2 className="animate-spin text-[#c19a6b]" /></div>;

  return (
    <div className="min-h-screen bg-[#1a140f] text-[#f5f5f5] p-6 lg:p-16 space-y-16">
      {/* Header - Image 2 style */}
      <header className="space-y-2">
        <p className="text-[#c19a6b] text-[10px] font-bold uppercase tracking-widest">Personal Library</p>
        <h1 className="text-5xl font-serif font-medium">Good Evening, Alex</h1>
        <p className="text-gray-500 italic text-sm">"A library is not a luxury but one of the necessities of life." — Henry Ward Beecher</p>
      </header>

      {/* 1. Currently Reading - Image 1 style */}
      <section>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-8">
          <h2 className="text-xl font-serif font-bold">Currently Reading</h2>
          <span className="text-xs text-gray-500">{library.currentlyReading.length} Books</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {library.currentlyReading.map((item: any) => (
            <div key={item._id} className="bg-[#261d15] rounded-2xl p-6 flex gap-6 border border-white/5 shadow-xl">
              <div className="relative w-28 h-40 flex-shrink-0 shadow-lg">
                <Image src={item.book.coverImage} alt="cover" fill className="object-cover rounded" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-xl font-bold font-serif">{item.book.title}</h3>
                  <p className="text-xs text-gray-500">by {item.book.author}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-[#c19a6b]">
                    <span>{item.currentPage} / {item.book.pages} Pages</span>
                    <span>{Math.round((item.currentPage/item.book.pages)*100)}%</span>
                  </div>
                  <div className="h-1 bg-black/40 rounded-full">
                    <div className="h-full bg-[#c19a6b] rounded-full transition-all duration-700" style={{ width: `${(item.currentPage/item.book.pages)*100}%` }}></div>
                  </div>
                  <button onClick={() => {setSelectedItem(item); setTempPage(item.currentPage); setIsModalOpen(true);}} className="w-full py-3 bg-[#33271c] hover:bg-[#c19a6b] hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all">Update Progress</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Want to Read - Vertical Grid style */}
      <section>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-8">
          <h2 className="text-xl font-serif font-bold">Want to Read</h2>
          <Link href="/books" className="text-[#c19a6b] text-xs hover:underline">View All →</Link>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-6 custom-scrollbar">
          {library.wantToRead.map((item: any) => (
            <div key={item._id} className="w-36 flex-shrink-0 space-y-3 group">
              <div className="relative aspect-[3/4.5] rounded-lg overflow-hidden shadow-2xl border border-white/5">
                <Image src={item.book.coverImage} alt="cover" fill className="object-cover" />
                {/* হোভার করলে Start Reading বাটন আসবে */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                   <button 
                     onClick={() => handleStartReading(item.book._id)}
                     className="bg-[#c19a6b] text-black text-[9px] font-black py-2 px-3 rounded uppercase tracking-tighter"
                   >
                     Start Reading
                   </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold truncate">{item.book.title}</h4>
                <p className="text-[10px] text-gray-500">{item.book.author}</p>
              </div>
            </div>
          ))}
         <Link href="/books" className="w-36 aspect-[3/4.5] border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:text-[#c19a6b] transition-all bg-white/5">
            <Plus size={30} />
            <span className="text-[10px] font-bold mt-2 uppercase">Add Book</span>
          </Link>
        </div>
      </section>

      {/* 3. Read - With Star Ratings style */}
      <section>
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-8">
          <h2 className="text-xl font-serif font-bold">Read</h2>
          <span className="text-xs text-gray-500">View All →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {library.read.map((item: any) => (
            <div key={item._id} className="space-y-3">
              <div className="relative aspect-[3/4.5] rounded-lg overflow-hidden shadow-2xl border border-white/5">
                <Image src={item.book.coverImage} alt="cover" fill className="object-cover opacity-80" />
                <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-500">5.0 ★</div>
              </div>
              <h4 className="text-xs font-bold truncate">{item.book.title}</h4>
              <div className="flex text-yellow-500 gap-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal - Dark Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-[#261d15] w-full max-w-sm rounded-3xl p-8 border border-white/10">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold italic">Update Stats</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Current Page</label>
                      <input type="number" value={tempPage} onChange={(e) => setTempPage(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-xl font-bold text-[#c19a6b] outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Total Pages</label>
                      <div className="w-full bg-black/10 border border-white/5 rounded-xl p-3 text-center text-xl font-bold text-gray-700">{selectedItem?.book.pages}</div>
                   </div>
                </div>
                <button onClick={() => handleUpdate()} className="w-full bg-[#c19a6b] text-black h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">Save Progress</button>
                <button onClick={() => handleUpdate('Read')} className="w-full bg-green-600/10 text-green-500 border border-green-600/20 h-12 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2">Mark as Finished</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLibraryPage;