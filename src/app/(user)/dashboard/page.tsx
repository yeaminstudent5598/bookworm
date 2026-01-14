"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Flame, BookOpen, Trophy, Plus, Settings, 
  Users, Star, Sparkles, ChevronRight, Info,
  Loader2
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, ResponsiveContainer, Tooltip, 
  CartesianGrid
} from 'recharts';
import Image from 'next/image';
import Link from 'next/link';

const COLORS = ['#22c55e', '#3b82f6', '#f1c40f', '#ef4444', '#8b5cf6'];

const UserDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ১. ড্যাশবোর্ড ডাটা ফেচ করা
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get('/api/v1/user/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setData(res.data.data);
      } catch (err) { 
        console.error("Dashboard Sync Failed:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-screen bg-[#05140b] flex items-center justify-center text-white font-serif italic">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#22c55e] animate-spin" />
        <p className="text-gray-500">Curating your reading stats...</p>
      </div>
    </div>
  );

  // সার্কুলার প্রগ্রেস চ্যালেঞ্জ ক্যালকুলেশন
  const goal = data?.challenge?.goal || 50;
  const finished = data?.stats?.booksFinished || 0;
  const percentage = Math.min(Math.round((finished / goal) * 100), 100);
  const strokeDasharray = 301.4; // 2 * PI * r (r=48)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* --- বাম সেকশন: স্ট্যাটস ও চার্ট --- */}
        <div className="flex-1 space-y-10">
          <header className="flex justify-between items-center border-b border-white/5 pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-serif font-bold tracking-tight">
                Welcome, {data?.user?.name?.split(' ')[0]} 📚
              </h1>
              <p className="text-gray-500 text-xs italic">"Keep tracking your journey through the world of words."</p>
            </div>
            <button className="p-3 bg-[#112216] rounded-2xl border border-white/5 hover:border-[#22c55e]/20 transition-all">
              <Settings size={20} className="text-gray-400"/>
            </button>
          </header>

          {/* রিডিং চ্যালেঞ্জ ও কুইক স্ট্যাটাস */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-[#112216] p-8 rounded-[2.5rem] flex items-center gap-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#05140b" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="56" cy="56" r="48" stroke="#22c55e" strokeWidth="10" fill="transparent" 
                    strokeDasharray={strokeDasharray} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">
                  {percentage}%
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#22c55e] text-[10px] font-black uppercase tracking-[0.2em]">
                  <Trophy size={14}/> 2026 Challenge
                </div>
                <h3 className="text-3xl font-bold">{finished} / {goal} Books</h3>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  You are {percentage}% through your goal. Read more to win the challenge!
                </p>
              </div>
            </div>

            <div className="bg-[#112216] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center items-center gap-3 shadow-2xl hover:translate-y-[-4px] transition-all">
               <Flame className="text-orange-500" size={32} />
               <h3 className="text-4xl font-black text-[#f1c40f]">{data?.stats?.streak || 0}</h3>
               <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Day Streak</p>
            </div>

            <div className="bg-[#112216] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center items-center gap-3 shadow-2xl hover:translate-y-[-4px] transition-all">
               <BookOpen className="text-blue-500" size={32} />
               <h3 className="text-4xl font-black text-[#22c55e]">{(data?.stats?.pagesRead || 0).toLocaleString()}</h3>
               <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Pages Read</p>
            </div>
          </div>

          {/* গ্রাফ ও চার্ট সেকশন (Extra Complexity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#112216] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Favorite Genres</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.charts?.genres || []} innerRadius={65} outerRadius={95} paddingAngle={10} dataKey="value">
                      {(data?.charts?.genres || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#05140b', border: 'none', borderRadius: '15px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#112216] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Pages per Month</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.charts?.monthly || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} dy={15} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#05140b', border: 'none', borderRadius: '15px'}} />
                    <Bar dataKey="pages" fill="#22c55e" radius={[10, 10, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* রেকমেন্ডেশন সেকশন (Fallback & Tooltip Logic) */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles className="text-[#22c55e]" size={20} />
                <h4 className="text-2xl font-serif font-bold italic">Curated For You</h4>
              </div>
              <Link href="/books" className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ChevronRight size={14}/>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data?.recommendations?.map((book: any) => (
                <div key={book._id} className="group relative space-y-3">
                  <Link href={`/books/${book._id}`}>
                    <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl group-hover:border-[#22c55e]/40 transition-all duration-500">
                      <Image src={book.coverImage} alt="cover" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                  </Link>
                  <div className="px-1">
                    <h5 className="text-[11px] font-bold truncate group-hover:text-[#22c55e] transition-colors">{book.title}</h5>
                    <p className="text-[9px] text-gray-500 italic">by {book.author}</p>
                  </div>

                  {/* ✅ "Why this book?" টুলটিপ (Bonus Requirement) */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#22c55e] text-black text-[9px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl z-50 flex items-center gap-2 border border-black/10">
                    <Info size={12}/> {book.reason || "Trending on BookWorm"}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#22c55e] rotate-45 border-r border-b border-black/10"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- ডান সেকশন: কমিউনিটি ফিড --- */}
        <aside className="w-full lg:w-96 bg-[#112216]/30 rounded-[3.5rem] p-10 border border-white/5 self-start shadow-2xl lg:sticky lg:top-10">
          <div className="flex justify-between items-center mb-12">
            <h4 className="font-bold text-2xl font-serif tracking-tight italic">Reader Feed</h4>
            <Users size={20} className="text-gray-500"/>
          </div>

          <div className="space-y-12">
            {data?.activities?.map((act: any, i: number) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-xl">
                  <Image src={act.userPhoto} alt="avatar" width={48} height={48} className="object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs leading-snug">
                    <span className="font-black text-[#22c55e] uppercase tracking-tighter">{act.userName}</span> 
                    <span className="text-gray-500 mx-1">finished</span> 
                    <span className="font-bold italic">"{act.target}"</span>
                  </p>
                  <div className="flex text-yellow-500 gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={10} fill={idx < act.rating ? "currentColor" : "none"} strokeWidth={idx < act.rating ? 0 : 2} />
                    ))}
                  </div>
                  {act.comment && (
                    <div className="bg-[#05140b]/60 p-4 rounded-2xl border border-white/5 mt-3">
                       <p className="text-[10px] text-gray-400 italic leading-relaxed line-clamp-2">"{act.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-16 py-5 bg-[#22c55e] text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-[#22c55e]/20">
            Find Friends
          </button>
        </aside>
      </div>
    </div>
  );
};

export default UserDashboard;