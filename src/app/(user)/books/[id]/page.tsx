"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  Star, Loader2, Send, ChevronLeft, Heart, Share2, MessageSquarePlus 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  
  // ✅ প্রগ্রেস ট্র্যাক করার জন্য লোকাল স্টেট
  const [localPage, setLocalPage] = useState(0);

  // ১. ডাটা ফেচিং
  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`/api/v1/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBook(res.data.data);
        setLocalPage(res.data.data.userProgress?.currentPage || 0); // ইনিশিয়াল প্রগ্রেস
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) fetchBook(); }, [id, fetchBook]);

  // ২. লাইব্রেরি ও প্রগ্রেস আপডেট
  const handleShelfUpdate = async (status: string, pagesRead?: number) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");
      const targetPage = pagesRead !== undefined ? pagesRead : localPage;

      await axios.patch('/api/v1/user/library', {
        bookId: id,
        status: status,
        currentPage: targetPage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBook(); // ডাটা রিফ্রেশ
    } catch (err) {
      alert("Failed to update library");
    } finally {
      setUpdating(false);
    }
  };

  // ৩. রিভিউ সাবমিট
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (review.comment.length < 10) return alert("Review must be 10+ characters");

    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");
      await axios.post('/api/v1/reviews', {
        bookId: id,
        rating: review.rating,
        comment: review.comment
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("Review submitted! Admin will moderate it.");
      setReview({ rating: 5, comment: "" });
      fetchBook();
    } catch (err) {
      alert("Error posting review");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#05140b]">
      <Loader2 className="animate-spin text-[#22c55e]" size={48} />
    </div>
  );

  // ৪. ডাইনামিক রেটিং লজিক (০ থাকলে রিভিউ থেকে গড় নিবে)
  const getDisplayRating = () => {
    if (book?.averageRating > 0) return book.averageRating.toFixed(1);
    if (book?.reviews?.length > 0) {
      const sum = book.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
      return (sum / book.reviews.length).toFixed(1);
    }
    return "0.0";
  };

  // ৫. প্রগ্রেস ক্যালকুলেশন
  const totalPg = book?.pages || 1;
  const progressPercent = Math.min(Math.round((localPage / totalPg) * 100), 100);

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumbs (ইমেজ অনুযায়ী) */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">
           <Link href="/books" className="hover:text-[#22c55e]">Library</Link>
           <span>/</span>
           <span className="text-gray-400">{book.genre?.name || "Fiction"}</span>
           <span>/</span>
           <span className="text-[#22c55e]">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Cover & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <Image src={book.coverImage} alt="Cover" fill className="object-cover" />
            </div>
            
            {/* Stats Card (Pages, Rating, Pub) */}
            <div className="grid grid-cols-3 gap-1 bg-[#112216] p-1 rounded-2xl border border-white/5">
               <div className="bg-[#05140b]/50 p-4 text-center rounded-xl">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Pages</p>
                  <p className="text-sm font-bold">{book.pages}</p>
               </div>
               <div className="bg-[#05140b]/50 p-4 text-center rounded-xl">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Rating</p>
                  <p className="text-sm font-bold flex items-center justify-center gap-1">
                    {getDisplayRating()} <Star size={10} className="fill-yellow-500 text-yellow-500"/>
                  </p>
               </div>
               <div className="bg-[#05140b]/50 p-4 text-center rounded-xl">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Pub</p>
                  <p className="text-sm font-bold">{book.pubYear || '2023'}</p>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content & Actions */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <h1 className="text-6xl font-serif font-bold tracking-tight leading-none">{book.title}</h1>
                    <p className="text-xl text-[#22c55e] font-medium italic">by {book.author}</p>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all"><Heart size={20}/></button>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#22c55e]/10 hover:text-[#22c55e] transition-all"><Share2 size={20}/></button>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#22c55e]/20">{book.genre?.name}</span>
                 <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Philosophical</span>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed font-light">{book.description}</p>
            </div>

            {/* --- Reading Progress Card (ইমেজ অনুযায়ী হুবহু) --- */}
            <div className="bg-[#112216] border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-end">
                  <div className="space-y-4 w-full max-w-xs">
                     <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Shelf Status</label>
                     <select 
                       className="w-full bg-[#05140b] border border-white/10 p-4 rounded-xl text-sm font-bold focus:ring-1 focus:ring-[#22c55e] outline-none cursor-pointer"
                       value={book.userProgress?.status || "Want to Read"}
                       onChange={(e) => handleShelfUpdate(e.target.value)}
                     >
                        <option value="Want to Read">Want to Read</option>
                        <option value="Currently Reading">Currently Reading</option>
                        <option value="Read">Read</option>
                     </select>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Reading Progress</p>
                     <p className="text-2xl font-bold text-[#22c55e] font-mono">{progressPercent}%</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    {/* ✅ প্রগ্রেস বার এনিমেশন */}
                    <div className="h-full bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-1000" style={{width: `${progressPercent}%`}}></div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2">
                       <input 
                         type="number" 
                         className="w-12 bg-transparent text-center font-bold text-[#22c55e] outline-none"
                         value={localPage}
                         onChange={(e) => setLocalPage(Number(e.target.value))}
                       />
                       <span className="text-[10px] text-gray-600 ml-1">pg</span>
                     </div>
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">of {book.pages} pg</span>
                     <button 
                       onClick={() => handleShelfUpdate(book.userProgress?.status || "Currently Reading")}
                       className="ml-auto text-[10px] font-black text-[#22c55e] uppercase tracking-widest hover:underline transition-all"
                     >
                        {updating ? "Updating..." : "Update"}
                     </button>
                  </div>
               </div>
            </div>

            {/* --- Community Reviews Section (ইমেজ অনুযায়ী হুবহু) --- */}
            <section className="space-y-10 pt-10">
               <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-serif font-bold italic">Community Reviews</h3>
                  <button onClick={() => document.getElementById('review-form')?.scrollIntoView({behavior: 'smooth'})} className="flex items-center gap-2 bg-[#22c55e] text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1db954] transition-all">
                    <MessageSquarePlus size={18}/> Write a Review
                  </button>
               </div>

               <div className="space-y-6">
                  {book.reviews && book.reviews.length > 0 ? book.reviews.map((rev: any) => (
                    <div key={rev._id} className="bg-white/2 border border-white/5 rounded-[2rem] p-8 space-y-4 hover:bg-white/[0.04] transition-all group">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-gray-800 relative overflow-hidden border border-white/10">
                                {rev.user?.photo && <Image src={rev.user.photo} alt="user" fill className="object-cover" />}
                             </div>
                             <div>
                            <h4 className="text-sm font-bold text-gray-200">{rev.user?.name}</h4>
                
                            {/* ✅ হার্ডকোডেড তারিখ পরিবর্তন করে ডাইনামিক করা হলো */}
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : "Date Unknown"}
                            </p>
                          </div>
                          </div>
                          <div className="flex text-[#22c55e] gap-0.5">
                             {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />)}
                          </div>
                       </div>
                       <p className="text-gray-400 leading-relaxed italic text-sm">"{rev.comment}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-24 bg-white/2 rounded-[2rem] border border-dashed border-white/10">
                       <p className="text-gray-600 font-serif italic text-lg">No approved reviews yet. Be the first reader to share your thoughts!</p>
                    </div>
                  )}
               </div>
            </section>

            {/* --- Review Form --- */}
            <form id="review-form" onSubmit={handleReviewSubmit} className="bg-[#112216] p-10 rounded-[3rem] border border-white/5 space-y-8 mt-20">
                <div className="space-y-4">
                   <h4 className="text-2xl font-serif font-bold italic text-[#22c55e]">Share Your Experience</h4>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 p-8 rounded-[2rem] outline-none focus:border-[#22c55e] transition-all min-h-[180px] text-gray-300 text-sm leading-relaxed"
                     placeholder="Tell the community how you felt about this journey..."
                     value={review.comment}
                     onChange={(e) => setReview({...review, comment: e.target.value})}
                   />
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex gap-3 bg-black/40 px-6 py-3 rounded-full border border-white/5 shadow-inner">
                      {[1,2,3,4,5].map(num => (
                        <Star key={num} size={24} className={`cursor-pointer transition-all hover:scale-125 ${review.rating >= num ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} onClick={() => setReview({...review, rating: num})}/>
                      ))}
                   </div>
                   <button type="submit" disabled={updating} className="bg-[#22c55e] text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#22c55e]/10">
                     {updating ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>} Submit Review
                   </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;