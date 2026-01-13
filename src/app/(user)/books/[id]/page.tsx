"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  Heart, Star, Edit3, Loader2, MessageSquare, Send 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  // API 1: Fetch Book Details
  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/books/${id}`);
      setBook(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchBook(); }, [id]);

  // API 2: Update Shelf Status & Progress
  const handleShelfUpdate = async (status: string, pagesRead?: number) => {
    try {
      setUpdating(true);
      await axios.post('/api/v1/shelf', {
        bookId: id,
        status: status || book.shelfStatus,
        currentPage: pagesRead !== undefined ? pagesRead : book.currentPage
      });
      fetchBook(); // ডাটা আপডেট হওয়ার পর রি-ফেচ
    } catch (err) {
      alert("Failed to update shelf");
    } finally {
      setUpdating(false);
    }
  };

  // API 3: Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await axios.post('/api/v1/reviews', {
        bookId: id,
        rating: review.rating,
        comment: review.comment
      });
      setReview({ rating: 5, comment: "" });
      fetchBook();
    } catch (err) {
      alert("Error posting review");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#05140b]"><Loader2 className="animate-spin text-[#22c55e]" size={48} /></div>;

  const progress = Math.round((book.currentPage / book.pages) * 100);

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Col: Cover */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            <Image src={book.image} alt={book.title} fill className="object-cover" />
          </div>
          <div className="flex gap-4">
             <div className="flex-1 bg-[#112216] p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Rating</p>
                <p className="text-lg font-bold flex items-center justify-center gap-1">{book.rating} <Star size={14} className="fill-yellow-500 text-yellow-500"/></p>
             </div>
             <div className="flex-1 bg-[#112216] p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Pages</p>
                <p className="text-lg font-bold">{book.pages}</p>
             </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-8 space-y-8">
          <header>
            <h1 className="text-5xl font-bold font-serif">{book.title}</h1>
            <p className="text-xl text-[#22c55e] mt-2">by {book.author}</p>
          </header>

          <p className="text-gray-400 italic text-lg leading-relaxed">{book.description}</p>

          {/* Shelf & Progress Update Card */}
          <div className="bg-[#112216] border border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Shelf Status</label>
                <select 
                  className="w-full bg-[#05140b] border border-gray-700 p-3 rounded-lg outline-none focus:ring-1 focus:ring-[#22c55e]"
                  value={book.shelfStatus}
                  onChange={(e) => handleShelfUpdate(e.target.value)}
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Read">Read</option>
                </select>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-gray-500 uppercase">Progress</p>
                 <p className="text-2xl font-bold text-[#22c55e]">{progress}%</p>
              </div>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#22c55e] transition-all" style={{width: `${progress}%`}}></div>
            </div>

            <div className="flex items-center gap-4">
               <input 
                type="number" 
                className="w-20 bg-[#05140b] border border-gray-700 p-2 rounded text-center"
                defaultValue={book.currentPage}
                onBlur={(e) => handleShelfUpdate(book.shelfStatus, Number(e.target.value))}
               />
               <span className="text-gray-500">of {book.pages} pages read</span>
            </div>
          </div>

          {/* Review Section */}
          <section className="pt-10 space-y-6">
            <h3 className="text-2xl font-bold border-b border-gray-800 pb-4">Community Reviews</h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-[#081b0f] p-6 rounded-xl border border-gray-800">
               <textarea 
                className="w-full bg-[#05140b] border border-gray-700 p-4 rounded-lg outline-none focus:border-[#22c55e]"
                placeholder="What did you think of this book?"
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
               />
               <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(num => (
                      <Star 
                        key={num} 
                        size={20} 
                        className={`cursor-pointer ${review.rating >= num ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                        onClick={() => setReview({...review, rating: num})}
                      />
                    ))}
                  </div>
                  <button type="submit" className="bg-[#22c55e] text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    {updating ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Post Review
                  </button>
               </div>
            </form>

            <div className="space-y-4 mt-6">
               {book.reviews.map((rev: any) => (
                 <div key={rev._id} className="p-4 border border-gray-800 rounded-lg bg-[#112216]/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{rev.userName}</span>
                      <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/> {rev.rating}</div>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{rev.comment}"</p>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;