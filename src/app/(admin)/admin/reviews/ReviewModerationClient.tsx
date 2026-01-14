"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Search, Loader2, Trash2, Check, Star, Inbox, 
  Clock, UserCheck, CheckCircle2, X 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReviewModerationClient({ initialReviews }: { initialReviews: any[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ১. ডাটা ফেচ করার লজিক (ট্যাব অনুযায়ী)
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setReviews([]); // ট্যাব পরিবর্তনের সময় পুরনো ডাটা মুছে ফেলা
      
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`/api/v1/admin/reviews?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ২. রিভিউ একশন হ্যান্ডলার (Approve/Delete)
  const handleAction = async (id: string, action: 'approve' | 'delete') => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (action === 'approve') {
        const res = await axios.patch(`/api/v1/admin/reviews/${id}`, { status: 'approved' }, config);
        if (res.data.success) {
          setSuccessMessage("Review has been approved and is now public.");
          setShowSuccessModal(true); // 🔥 সাকসেস মোডাল শো করা
        }
      } else {
        if (!window.confirm("Delete permanently?")) return;
        await axios.delete(`/api/v1/admin/reviews/${id}`, config);
      }
      
      fetchReviews(); 
      router.refresh(); // সার্ভার ডাটা সিঙ্ক
    } catch (err) {
      alert("Action failed!");
    }
  };

  const filteredReviews = reviews?.filter(rev => 
    rev.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // --- 💀 Professional Skeleton Loader ---
  const CardSkeleton = () => (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-[#1a140f] border border-white/5 rounded-2xl p-6 sm:p-8 animate-pulse space-y-6">
           <div className="flex justify-between"><div className="w-40 h-8 bg-white/5 rounded-full"/><div className="w-16 h-3 bg-white/5 rounded"/></div>
           <div className="flex gap-6">
              <div className="w-20 h-28 bg-white/5 rounded-lg" />
              <div className="flex-1 space-y-3"><div className="h-4 bg-white/5 w-1/2 rounded"/><div className="h-16 bg-white/5 w-full rounded-xl"/></div>
           </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Review Portal</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Administrative Control</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" placeholder="Search book or user..."
            className="w-full bg-[#112216] border border-white/5 rounded-xl py-3 pl-12 pr-6 text-xs text-white outline-none focus:ring-1 focus:ring-[#c19a6b] transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs System */}
      <div className="flex border-b border-white/5 gap-2">
        {["pending", "approved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? "text-[#c19a6b]" : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab} Queue ({activeTab === tab ? filteredReviews.length : "..."})
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c19a6b]" />}
          </button>
        ))}
      </div>

      {/* Reviews Display Area */}
      <div className="space-y-6">
        {loading ? (
          <CardSkeleton />
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-[#1a140f] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-[#c19a6b]/20 transition-all">
              
              {/* Card Top */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black/40">
                    <Image src={review.user?.photo || "/placeholder-avatar.png"} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 text-sm flex items-center gap-2">
                      {review.user?.name}
                      <span className="bg-white/5 text-[7px] px-2 py-0.5 rounded text-gray-500 font-black uppercase tracking-tighter flex items-center gap-1">
                        <UserCheck size={8} className="text-[#22c55e]"/> Verified
                      </span>
                    </h4>
                    <p className="text-[9px] text-gray-600 flex items-center gap-1.5 mt-0.5 uppercase font-bold">
                      <Clock size={10}/> {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Just now"}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                  review.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'
                }`}>
                  {review.status}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-white/5 flex-shrink-0 shadow-xl">
                   <Image src={review.book?.coverImage || "/placeholder-book.png"} alt="Book" fill className="object-cover" />
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-white leading-tight">{review.book?.title}</h3>
                      <p className="text-[10px] text-gray-500 italic">by {review.book?.author}</p>
                    </div>
                    <div className="flex text-yellow-500 gap-0.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-800"} />)}
                    </div>
                  </div>
                  
                  <div className="bg-[#0d0a07] p-4 rounded-xl border border-white/5 relative">
                    <p className="text-xs text-gray-400 italic leading-relaxed font-serif line-clamp-3">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex justify-end items-center gap-3 mt-6 pt-6 border-t border-white/5">
                <button 
                  onClick={() => handleAction(review._id, 'delete')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Trash2 size={14}/> Delete
                </button>
                {review.status === 'pending' && (
                  <button 
                    onClick={() => handleAction(review._id, 'approve')}
                    className="flex items-center gap-2 px-5 py-2 bg-[#2d4a3e] text-[#22c55e] hover:bg-[#22c55e] hover:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
                  >
                    <Check size={14}/> Approve Review
                  </button>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center space-y-4 text-gray-700 border-2 border-dashed border-white/5 rounded-[2rem]">
            <Inbox size={48} className="opacity-10" />
            <p className="font-serif italic text-sm opacity-50">Queue is empty</p>
          </div>
        )}
      </div>

      {/* --- ✅ Success Modal (image_c7d0cb style) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a140f] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-10 text-center space-y-8 shadow-2xl relative">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors">
              <X size={20} />
            </button>

            {/* Success Icon */}
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
               <CheckCircle2 size={40} className="text-[#22c55e]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">Review Approved!</h2>
              <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-tighter px-4">
                {successMessage}
              </p>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-[#c19a6b] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#d4ac7d] transition-all"
            >
              Continue Moderating
            </button>
          </div>
        </div>
      )}

    </div>
  );
}