"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  Search, Loader2, Trash2, CheckCircle2, 
  MessageSquare, Clock, Star, AlertCircle 
} from "lucide-react";
import Image from "next/image";

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // ১. এপিআই থেকে রিভিউ ফেচ করা (Axios)
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      // কুয়েরি প্যারামিটারে স্ট্যাটাস পাঠানো হচ্ছে
      const res = await axios.get(`/api/v1/admin/reviews?status=${activeTab}`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // ২. রিভিউ আপডেট বা ডিলিট করা (Axios)
  const handleStatusUpdate = async (id: string, action: 'approve' | 'delete') => {
    try {
      if (action === 'approve') {
        // PATCH রিকোয়েস্ট স্ট্যাটাস পরিবর্তনের জন্য
        await axios.patch(`/api/v1/admin/reviews/${id}`, { status: 'approved' });
      } else {
        if (!window.confirm("Delete this review permanently?")) return;
        // DELETE রিকোয়েস্ট ডাটাবেস থেকে সরানোর জন্য
        await axios.delete(`/api/v1/admin/reviews/${id}`);
      }
      fetchReviews(); // ডাটা রিফ্রেশ করা
    } catch (err) {
      alert("Operation failed on server.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Review Moderation Queue</h1>
          <p className="text-gray-500 mt-2">Manage and moderate pending community submissions.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#112216] border border-gray-800 p-4 rounded-xl min-w-[120px] text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Pending</p>
            <h3 className="text-2xl font-bold text-orange-500">{activeTab === 'pending' ? reviews.length : 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-[#112216] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="flex border-b border-gray-800">
          {["pending", "approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "text-[#22c55e] border-b-2 border-[#22c55e] bg-white/[0.02]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab} Reviews
            </button>
          ))}
        </div>

        <div className="p-6 bg-black/20 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text"
              placeholder="Search reviews..."
              className="w-full bg-[#05140b] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-[#22c55e] outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Review Cards */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#22c55e]" size={40} /></div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-black/30 border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-800">
                      <Image src={review.user?.photo || "/placeholder-avatar.png"} alt="User" fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-200">{review.user?.name}</h4>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest border ${review.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'}`}>
                    {review.status}
                  </span>
                </div>

                <div className="flex gap-6">
                  <div className="relative w-20 h-28 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800">
                    <Image src={review.book?.coverImage || "/placeholder-book.png"} alt="Book" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold text-white">{review.book?.title}</h3>
                      <div className="flex gap-0.5 text-orange-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    <div className="bg-[#05140b] p-4 rounded-xl border border-gray-800/50">
                      {/* ✅ মডেল অনুযায়ী comment ব্যবহার করা হয়েছে */}
                      <p className="text-sm text-gray-400 italic">"{review.comment}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800/50">
                  <button 
                    onClick={() => handleStatusUpdate(review._id, 'delete')}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  {review.status === 'pending' && (
                    <button 
                      onClick={() => handleStatusUpdate(review._id, 'approve')}
                      className="flex items-center gap-2 px-8 py-2.5 bg-[#2d5a4c] text-[#22c55e] hover:bg-[#22c55e] hover:text-black font-bold text-xs rounded-xl transition-all shadow-lg"
                    >
                      <CheckCircle2 size={14} /> Approve Review
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-600 italic">No reviews found in this queue.</div>
          )}
        </div>
      </div>
    </div>
  );
}