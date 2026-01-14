"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Play, X, Search, Sparkles, 
  Calendar, BookOpen, SearchX, Loader2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { TutorialsSkeleton } from '@/skeletons';

interface ITutorial {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
  createdAt: string;
}

const TutorialsClient = () => {
  const [tutorials, setTutorials] = useState<ITutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<ITutorial | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ প্যাগিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYTThumb = (url: string) => {
    const id = getYoutubeID(url);
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "/placeholder.png";
  };

const fetchTutorials = useCallback(async (query: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get('/api/v1/tutorials', {
        params: { 
          searchTerm: query || undefined, 
          page: page,
          limit: 8 
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // ✅ ফিক্স: response.data.data এখন একটি অবজেক্ট, যার ভেতর আসল array-টি আছে 'data' নামে
        const fetchedData = response.data.data.data; 
        const fetchedMeta = response.data.data.meta;

        // নিশ্চিত হচ্ছি যে এটি একটি Array
        setTutorials(Array.isArray(fetchedData) ? fetchedData : []);
        setMeta(fetchedMeta || { totalPages: 1, total: 0 });
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setTutorials([]); 
      setError("Failed to load tutorials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTutorials(searchTerm, currentPage);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchTutorials]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  if (loading && tutorials.length === 0) return <TutorialsSkeleton />;

  return (
    <div className="min-h-screen bg-[#05140b] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header & Search */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-[#22c55e] text-[10px] font-black uppercase tracking-[0.4em]">
              <Sparkles size={14} className="animate-pulse" /> Knowledge Base
            </div>
            <h1 className="text-5xl lg:text-6xl font-serif font-bold tracking-tight">Tutorials</h1>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#22c55e]" size={20} />
            <input 
              type="text" 
              placeholder="Search guides..." 
              className="w-full bg-[#112216] border border-white/5 rounded-2xl py-4 pl-14 pr-12 text-sm focus:border-[#22c55e]/30 outline-none transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#22c55e]" size={18} />}
          </div>
        </header>

        {/* Grid Area */}
        {tutorials.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center gap-4">
             <SearchX size={48} className="opacity-20" />
             <p className="text-gray-500 italic">No results found for "{searchTerm}"</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {tutorials.map((item) => (
                <div key={item._id} className="group bg-[#112216]/50 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col hover:border-[#22c55e]/20 transition-all">
                  <div className="relative aspect-video cursor-pointer" onClick={() => setSelectedVideo(item)}>
                    <Image src={getYTThumb(item.videoUrl)} alt="thumb" fill className="object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#22c55e] rounded-full flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-all">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1">
                    <h3 className="text-sm font-bold line-clamp-2 group-hover:text-[#22c55e]">{item.title}</h3>
                    <p className="text-[10px] text-gray-500 italic line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ প্রফেশনাল প্যাগিনেশন UI */}
            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 rounded-xl bg-[#112216] border border-white/5 disabled:opacity-20 hover:text-[#22c55e] transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(meta.totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                      currentPage === index + 1 
                      ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20' 
                      : 'bg-[#112216] border border-white/5 text-gray-500 hover:border-[#22c55e]'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === meta.totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 rounded-xl bg-[#112216] border border-white/5 disabled:opacity-20 hover:text-[#22c55e] transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 lg:p-20" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-white/10"><X size={24}/></button>
            <iframe 
              src={`https://www.youtube.com/embed/${getYoutubeID(selectedVideo.videoUrl)}?autoplay=1`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialsClient;