"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Flame, BookOpen, Trophy, Plus, Clock, 
  Users, Settings, Search, Star, Sparkles 
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
        <div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Syncing your library stats...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05140b] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-8">
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold">Welcome back, {data?.user?.name?.split(' ')[0]}</h1>
              <p className="text-gray-500 text-sm italic">"A room without books is like a body without a soul."</p>
            </div>
            <div className="flex gap-4">
               <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="text" placeholder="Search library..." className="bg-[#112216] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-[#22c55e]/30" />
               </div>
               <button className="p-2.5 bg-[#112216] rounded-xl border border-white/5"><Settings size={18} className="text-gray-400"/></button>
            </div>
          </header>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 2026 Challenge */}
            <div className="md:col-span-2 bg-[#112216] p-8 rounded-3xl flex items-center gap-8 border border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#1a2e1f" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="56" cy="56" r="48" stroke="#22c55e" strokeWidth="10" fill="transparent" 
                    strokeDasharray="301.4" 
                    strokeDashoffset={301.4 - (301.4 * (data?.stats?.booksFinished || 0) / 50)} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                  {Math.round(((data?.stats?.booksFinished || 0) / 50) * 100)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#22c55e] text-[10px] font-black uppercase tracking-widest">
                  <Trophy size={12}/> 2026 Challenge
                </div>
                <h3 className="text-2xl font-bold">{data?.stats?.booksFinished || 0} of 50 Books</h3>
                <p className="text-xs text-gray-500 leading-relaxed">You're on track! Read roughly 3 more books this month to stay ahead.</p>
              </div>
            </div>

            {/* Day Streak */}
            <div className="bg-[#112216] p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center gap-3 hover:border-orange-500/20 transition-all shadow-xl">
               <Flame className="text-orange-500" size={24} />
               <h3 className="text-3xl font-bold text-[#f1c40f]">{data?.stats?.streak || 0}</h3>
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Day Streak</p>
            </div>

            {/* Total Pages (Fixed Field Name) */}
            <div className="bg-[#112216] p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center gap-3 hover:border-blue-500/20 transition-all shadow-xl">
               <BookOpen className="text-blue-500" size={24} />
               {/* ✅ সমাধান: ব্যাকএন্ডে 'pagesRead' নামে ডাটা পাঠানো হচ্ছে */}
               <h3 className="text-3xl font-bold text-[#22c55e]">
                 {(data?.stats?.pagesRead || 0).toLocaleString()}
               </h3>
               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Total Pages</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genre Breakdown */}
            <div className="bg-[#112216] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8">Genre Breakdown</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.charts?.genres || []} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                      {(data?.charts?.genres || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#05140b', border: 'none', borderRadius: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Progress (Updated Styling) */}
            <div className="bg-[#112216] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8">Monthly Progress</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.charts?.monthly || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} dy={10} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#05140b', border: 'none', borderRadius: '12px'}} />
                    <Bar 
                      dataKey="pages" 
                      fill="#22c55e" 
                      radius={[6, 6, 0, 0]} 
                      barSize={25} // ✅ চিকন বার ডিজাইন করা হয়েছে
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations Row */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#22c55e]" size={18} />
                <h4 className="text-xl font-serif font-bold italic">Curated For You</h4>
              </div>
              <Link href="/books" className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data?.recommendations?.map((book: any) => (
                <Link href={`/books/${book._id}`} key={book._id} className="group space-y-3">
                  <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:border-[#22c55e]/30 transition-all">
                    <Image src={book.coverImage} alt="cover" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="px-1">
                    <h5 className="text-xs font-bold truncate group-hover:text-[#22c55e] transition-colors">{book.title}</h5>
                    <p className="text-[10px] text-gray-500 italic">by {book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SECTION: Community Sidebar */}
        <aside className="w-full lg:w-85 bg-[#112216]/40 rounded-[3rem] p-8 border border-white/5 self-start shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-bold text-xl font-serif">Community</h4>
            <Users size={20} className="text-gray-500"/>
          </div>
          <div className="space-y-10">
            {data?.activities?.map((act: any, i: number) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/5 group-hover:border-[#22c55e]/30 transition-all shadow-lg">
                  <Image src={act.userPhoto} alt="avatar" width={44} height={44} className="object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-xs leading-snug">
                    <span className="font-bold text-[#f1c40f]">{act.userName}</span> {act.action} <span className="font-medium text-[#22c55e]">"{act.target}"</span>
                  </p>
                  <div className="flex text-yellow-500 gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={10} fill={idx < act.rating ? "currentColor" : "none"} strokeWidth={idx < act.rating ? 0 : 2} />
                    ))}
                  </div>
                  {act.comment && (
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5 mt-2">
                       <p className="text-[10px] text-gray-500 italic leading-relaxed">"{act.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-12 bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#22c55e] hover:text-black transition-all shadow-xl active:scale-95">
            Find Friends
          </button>
        </aside>
      </div>
    </div>
  );
};

export default UserDashboard;