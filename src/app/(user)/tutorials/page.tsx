"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Play, Eye, X, Search, Loader2, 
  Sparkles, Youtube, Clock 
} from 'lucide-react';
import Image from 'next/image';

interface ITutorial {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
  views?: number; // ব্যাকএন্ড থেকে আসলে এটি ব্যবহার হবে
  createdAt: string;
}

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState<ITutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<ITutorial | null>(null);

  // ১. ইউটিউব ভিডিও আইডি এবং থাম্বনেইল হেল্পার
  const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYTThumb = (url: string) => {
    const id = getYoutubeID(url);
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "/placeholder.png";
  };

  // ২. ডাটা ফেচিং
  const fetchTutorials = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get('/api/v1/tutorials', {
        params: { searchTerm },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTutorials(res.data.data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => { fetchTutorials(); }, [fetchTutorials]);

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#22c55e] text-[10px] font-black uppercase tracking-[0.4em]">
              <Sparkles size={14}/> Knowledge Hub
            </div>
            <h1 className="text-5xl font-serif font-bold tracking-tight">Tutorials</h1>
            <p className="text-gray-500 text-sm italic">Explore our collection of video guides curated for you.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Search guides..." 
              className="w-full bg-[#112216] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#22c55e]/30 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#22c55e]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tutorials.map((item) => (
              <div key={item._id} className="group bg-[#112216] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl transition-all hover:border-[#22c55e]/20">
                
                {/* Thumbnail Header with Play Button */}
                <div 
                  className="relative aspect-video overflow-hidden cursor-pointer"
                  onClick={() => setSelectedVideo(item)}
                >
                  <Image 
                    src={getYTThumb(item.videoUrl)} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[#22c55e] rounded-full flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold leading-tight group-hover:text-[#22c55e] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  
                  {/* ✅ Description দেখানো হচ্ছে */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 italic">
                    "{item.description}"
                  </p>
                  
                  {/* Footer (Views & Date) */}
                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#22c55e]">
                      <Eye size={14} />
                      {/* ✅ ভিউ কাউন্ট (ব্যাকএন্ডে না থাকলে রেন্ডম বা স্ট্যাটিক দিতে পারেন) */}
                      <span className="text-[10px] font-black uppercase">{item.views} Views</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-[10px] font-bold">
                       <Clock size={12}/> 
                       {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ ভিডিও প্লেয়ার মডাল */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 lg:p-20">
             <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10">
                <button 
                  onClick={() => setSelectedVideo(null)} 
                  className="absolute top-6 right-6 z-10 bg-black/50 p-2 rounded-full hover:bg-white/10 transition-all text-white"
                >
                  <X size={24} />
                </button>
                <iframe 
                  src={`https://www.youtube.com/embed/${getYoutubeID(selectedVideo.videoUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;