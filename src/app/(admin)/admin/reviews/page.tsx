"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  Search, Loader2, Trash2, CheckCircle2, 
  Star 
} from "lucide-react";
import Image from "next/image";

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // ১. এপিআই থেকে রিভিউ ফেচ করা (Authorization Header সহ)
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken"); // ✅ টোকেন নেওয়া হলো

      const res = await axios.get(`/api/v1/admin/reviews?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` } // ✅ হেডারে টোকেন পাঠানো হলো
      });

      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err: any) {
      console.error("🚩 Fetch Error:", err.response?.data?.message || err.message);
      // যদি Access Denied হয়, তবে ইউজারকে সতর্ক করা
      if (err.response?.status === 403) alert("Access Denied! Admin only.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // ২. রিভিউ আপডেট বা ডিলিট করা (Token সহ)
  const handleStatusUpdate = async (id: string, action: 'approve' | 'delete') => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (action === 'approve') {
        await axios.patch(`/api/v1/admin/reviews/${id}`, { status: 'approved' }, config);
      } else {
        if (!window.confirm("Delete this review permanently?")) return;
        await axios.delete(`/api/v1/admin/reviews/${id}`, config);
      }
      
      fetchReviews(); // সফল হলে লিস্ট রিফ্রেশ করা
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  // সার্চ ফিল্টারিং লজিক
  const filteredReviews = reviews.filter(rev => 
    rev.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Review Moderation</h1>
          <p className="text-gray-500 mt-1 text-sm italic">Approve or remove community feedback.</p>
        </div>
        <div className="bg-[#112216] border border-gray-800 px-6 py-3 rounded-2xl">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Queue Size</p>
          <h3 className="text-2xl font-bold text-[#22c55e]">{filteredReviews.length}</h3>
        </div>
      </div>

      {/* Tabs & Search Box */}
      <div className="bg-[#112216] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="flex border-b border-gray-800 bg-black/20">
          {["pending", "approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab ? "text-[#22c55e] border-b-2 border-[#22c55e] bg-white/[0.03]" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab} Reviews
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" placeholder="Search by book or user..."
              className="w-full bg-[#05140b] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-[#22c55e]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Grid Layout for Reviews */}
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#22c55e]" size={40} /></div>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="bg-black/40 border border-gray-800/50 rounded-[1.5rem] p-6 hover:border-[#22c55e]/20 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* User & Book Info */}
                    <div className="flex gap-4 min-w-[250px]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-800 flex-shrink-0">
                        <Image src={review.user?.photo || "/placeholder-avatar.png"} alt="User" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-200">{review.user?.name}</h4>
                        <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">Verified Reader</p>
                      </div>
                    </div>

                    {/* Book Detail & Comment */}
                    <div className="flex-1 flex gap-6">
                       <div className="relative w-16 h-24 rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                          <Image src={review.book?.coverImage || "/placeholder-book.png"} alt="Book" fill className="object-cover" />
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between items-center">
                             <h3 className="font-bold text-white leading-tight">{review.book?.title}</h3>
                             <div className="flex text-yellow-500 gap-0.5 ml-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                             </div>
                          </div>
                          <div className="bg-[#05140b] p-4 rounded-xl border border-gray-800/50">
                             <p className="text-xs text-gray-400 italic leading-relaxed">"{review.comment}"</p>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col justify-end gap-3">
                      <button 
                        onClick={() => handleStatusUpdate(review._id, 'delete')}
                        className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all" title="Delete"
                      ><Trash2 size={20} /></button>
                      {review.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(review._id, 'approve')}
                          className="p-3 bg-[#2d5a4c] text-[#22c55e] hover:bg-[#22c55e] hover:text-black rounded-xl transition-all shadow-lg" title="Approve"
                        ><CheckCircle2 size={20} /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-600 italic">No reviews found in this queue.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}